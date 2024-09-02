import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [images, setImages] = useState([null, null]);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRefs = [useRef(null), useRef(null)];
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      setModelLoaded(true);
      console.log('Models loaded successfully');
    };

    loadModels();
    startVideo();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        } else {
          console.error('Video reference is null');
        }
      })
      .catch((err) => {
        console.error('Error accessing the camera', err);
      });
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const takePicture = (step) => {
    const context = canvasRefs[step].current.getContext('2d');
    if (videoRef.current.readyState === 4) { // Check if the video is ready
      context.drawImage(videoRef.current, 0, 0, canvasRefs[step].current.width, canvasRefs[step].current.height);
      const dataUrl = canvasRefs[step].current.toDataURL('image/png');
      
      let updatedImages = [...images];
      updatedImages[step] = dataUrl;
      setImages(updatedImages);

      if (step === 0) {
        setCurrentStep(1);  // Move to the next step to take the selfie
        alert("ID picture taken. Now take a selfie.");
      } else {
        stopVideo();  // Stop video after taking the selfie
        setCurrentStep(2);  // Move to the final step to show images side by side
      }
    } else {
      console.error('Video is not ready for capturing');
    }
  };

  const handleProcessImage = async () => {
    setLoading(true);  // Start loading before verification
    console.log('Processing images');
    if (images[0] && images[1] && modelLoaded) {
      const imgElements = [
        new Image(),
        new Image()
      ];

      imgElements[0].src = images[0];
      imgElements[1].src = images[1];

      await Promise.all(
        imgElements.map(img => new Promise(resolve => {
          img.onload = resolve;
        }))
      );

      const fullFaceDescriptions = await Promise.all(
        imgElements.map(img => faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors())
      );

      setLoading(false);  // Stop loading after processing

      if (fullFaceDescriptions[0].length < 1 || fullFaceDescriptions[1].length < 1) {
        setResult('Both images must contain at least one face.');
        return;
      }

      const distance = faceapi.euclideanDistance(fullFaceDescriptions[0][0].descriptor, fullFaceDescriptions[1][0].descriptor);
      const similarity = 100 - distance * 100;

      setResult(`The two faces are ${similarity.toFixed(2)}% similar.`);

      if (similarity > 35) {
        navigate('/verified');
      } else {
        setResult('Not verified. The similarity is below the threshold.');
      }
    }
  };

  return (
    <div className="home-container">
      <h1>Face ID Verification</h1>
      <div className="camera-container">
        {currentStep < 2 && (
          <video ref={videoRef} autoPlay muted className="video-feed" />
        )}

        <canvas ref={canvasRefs[0]} style={{ display: 'none' }} width="640" height="480"></canvas>
        <canvas ref={canvasRefs[1]} style={{ display: 'none' }} width="640" height="480"></canvas>

        {currentStep === 0 && (
          <button onClick={() => takePicture(0)} className="process-button" disabled={loading}>
            Take ID Picture
          </button>
        )}

        {currentStep === 1 && (
          <button onClick={() => takePicture(1)} className="process-button" disabled={loading}>
            Take Selfie
          </button>
        )}

        {currentStep === 2 && (
          <div className="image-preview-container">
            <img src={images[0]} alt="ID Picture" className="image-preview" />
            <img src={images[1]} alt="Selfie" className="image-preview" />
          </div>
        )}

        {images[0] && images[1] && currentStep === 2 && (
          <button onClick={handleProcessImage} className="process-button" disabled={loading}>
            Verify Images
          </button>
        )}
      </div>

      {loading && (
        <div className="loading-container">
          <p>Verifying...</p>
        </div>
      )}

      {result && (
        <div className="result-container">
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
