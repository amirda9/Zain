import React from 'react';
import QRCode from 'qrcode.react'; // Correct import
import { FaCheckCircle } from 'react-icons/fa'; // Import a green success check icon
import './VerifiedPage.css';

function VerifiedPage() {
  return (
    <div className="verified-container">
      <FaCheckCircle className="success-icon" />
      <h1>Verified</h1>
      <p>Your identity has been verified. You are ready to scan and enter the event.</p>
      
      <div className="qr-container">
        <QRCode value="https://hadeth.org" size={150} /> {/* Replace with your event link */}
      </div>
    </div>
  );
}

export default VerifiedPage;
