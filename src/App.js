import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import Home from './Home';
import './Auth.css';

function App() {
  const [currentView, setCurrentView] = useState('signIn');

  const renderView = () => {
    switch (currentView) {
      case 'signIn':
        return (
          <SignIn
            onSignUpClick={() => setCurrentView('signUp')}
            onForgotPasswordClick={() => setCurrentView('forgotPassword')}
          />
        );
      case 'signUp':
        return <SignUp onSignInClick={() => setCurrentView('signIn')} />;
      case 'forgotPassword':
        return <ForgotPassword onSignInClick={() => setCurrentView('signIn')} />;
      default:
        return <SignIn />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={renderView()} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
