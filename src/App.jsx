import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './input.css';
import ChatInterface from './Components/ChatInterface';
import MagnifierScreen from './Components/MagnifierScreen';
import { useMsal, useMsalAuthentication } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';

const App = () => {
  // Trigger MSAL authentication with redirect method
  const { instance, accounts } = useMsal();
  const { login, result, error, inProgress } = useMsalAuthentication(InteractionType.Redirect);

  // State for storing logged-in user info
  const [m_strUser, setm_steUser] = useState("");

  // If authentication is still in progress, don't render the app yet
  if (inProgress === 'login') {
    return <div>Logging in...</div>;
  }

  // Set the user information once login is completed
  useEffect(() => {
    if (accounts.length > 0) {
      const username = accounts[0]?.username || '';  // Safely access username
      setm_steUser(username);
    }
  }, [accounts]);

  // Conditional render based on user information
  if (m_strUser === "") {
    return (
      <div>
        Please wait...
        {/* Call login if the user is not logged in */}
        {!m_strUser && !error && (
          <button onClick={() => login()}>
            Log in
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
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
