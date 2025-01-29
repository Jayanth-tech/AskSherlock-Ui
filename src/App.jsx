import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './input.css';
import ChatInterface from './Components/ChatInterface';
import MagnifierScreen from './Components/MagnifierScreen';
import { useMsal, useMsalAuthentication } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';

const App = () => {
  const { instance, accounts } = useMsal();
  const { login, result, error, inProgress } = useMsalAuthentication(InteractionType.Redirect);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhoto, setUserPhoto] = useState("");

  if (inProgress === 'login') {
    return <div>Logging in...</div>;
  }

  useEffect(() => {
    if (accounts.length > 0) {
      const email = accounts[0]?.username || '';
      // Format email to display name (e.g., "JayanthB3@quinnox.com" → "Jayanth B")
      const formattedName = email
        .split('@')[0]
        .replace(/[0-9]/g, '')
        .replace(/([A-Z])/g, ' $1')
        .trim();
      
      setUserName(formattedName || "Guest User");
      setUserEmail(email);

      const userProfile = accounts[0]?.idTokenClaims || {};
      const photoUrl = userProfile?.picture || '';
      setUserPhoto(photoUrl);
    }
  }, [accounts]);

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  };

  if (userName === "") {
    return (
      <div className='flex justify-center items-center mt-[40vh] flex-col'>
        <div className='text-center'>Please wait<br/> We are authenticating you</div>
        <div>
          <span className="loading loading-bars loading-lg "></span>
        </div>
        {!userName && !error && (
          <button onClick={() => login()}>
          </button>
        )}
        {error && <div>{error.message}</div>}
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MagnifierScreen />} />
        <Route
          path="/chat"
          element={
            <ChatInterface 
              userName={userName} 
              userEmail={userEmail}
              photo={userPhoto}
              onLogout={handleLogout}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;