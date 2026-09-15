import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import { api } from './services/api';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [sessionId, setSessionId] = useState(api.getSessionId());
  const [secondsUntilRotation, setSecondsUntilRotation] = useState(900);
  const [rotationNotice, setRotationNotice] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Session rotation callback handler
    api.setOnSessionRotated((newId) => {
      setSessionId(newId);
      setSecondsUntilRotation(900);
      setRotationNotice(true);
      setTimeout(() => setRotationNotice(false), 6000);
    });

    checkSession();
  }, []);

  // Timer countdown tick & automatic rotation check
  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => {
      setSecondsUntilRotation((prev) => {
        if (prev <= 1) {
          checkSession();
          return 900;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [authenticated]);

  const checkSession = async () => {
    try {
      if (api.getSessionId()) {
        const res = await api.getCurrentUser();
        if (res?.user?.username) {
          setAuthenticated(true);
          setUsername(res.user.username);
          setSessionId(res.session.session_id);
          setSecondsUntilRotation(res.session.seconds_until_rotation);
        } else {
          setAuthenticated(false);
        }
      }
    } catch (e) {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (user, pass) => {
    const res = await api.login(user, pass);
    if (res?.user?.username) {
      setAuthenticated(true);
      setUsername(res.user.username);
      setSessionId(res.session.session_id);
      setSecondsUntilRotation(res.session.seconds_until_rotation || 900);
    }
  };

  const handleRegisterSuccess = async (user, pass) => {
    const res = await api.register(user, pass);
    if (res?.user?.username) {
      setAuthenticated(true);
      setUsername(res.user.username);
      setSessionId(res.session.session_id);
      setSecondsUntilRotation(res.session.seconds_until_rotation || 900);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setAuthenticated(false);
    setUsername('');
    setSessionId(null);
  };

  const handleTestRotate = async () => {
    try {
      const res = await api.testRotateSession();
      if (res?.new_session_id) {
        setSessionId(res.new_session_id);
        setSecondsUntilRotation(900);
        setRotationNotice(true);
        setTimeout(() => setRotationNotice(false), 6000);
      }
    } catch (err) {
      console.error('Test rotate error:', err);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#676767',
        fontSize: '14px'
      }}>
        Initializing ChatGPT...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      {!authenticated ? (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
        />
      ) : (
        <Chat
          username={username}
          sessionInfo={{ sessionId, secondsUntilRotation }}
          rotationNotice={rotationNotice}
          onLogout={handleLogout}
          onTestRotate={handleTestRotate}
        />
      )}
    </div>
  );
}
