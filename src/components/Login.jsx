import React, { useState } from 'react';
import { Bot, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function Login({ onLoginSuccess, onRegisterSuccess }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanUsername || !cleanPassword) {
      setError('Please enter both username and password.');
      return;
    }

    if (isRegisterMode) {
      if (!cleanConfirm) {
        setError('Please confirm your password.');
        return;
      }
      if (cleanPassword !== cleanConfirm) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      if (isRegisterMode) {
        await onRegisterSuccess(cleanUsername, cleanPassword);
      } else {
        await onLoginSuccess(cleanUsername, cleanPassword);
      }
    } catch (err) {
      setError(err.message || (isRegisterMode ? 'Registration failed.' : 'Invalid credentials.'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (targetRegisterMode) => {
    setIsRegisterMode(targetRegisterMode);
    setError('');
    if (targetRegisterMode) {
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setUsername('admin');
      setPassword('password123');
      setConfirmPassword('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      padding: '24px'
    }}>
      {/* ChatGPT Green Logo Icon */}
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        backgroundColor: '#10a37f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: '0 4px 14px rgba(16, 163, 127, 0.25)'
      }}>
        <Bot size={30} color="#ffffff" />
      </div>

      <div style={{
        width: '100%',
        maxWidth: '380px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#0d0d0d',
          marginBottom: '8px',
          letterSpacing: '-0.02em'
        }}>
          {isRegisterMode ? 'Create your account' : 'Welcome back'}
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#676767',
          marginBottom: '28px'
        }}>
          {isRegisterMode
            ? 'Sign up to start chatting with session security'
            : 'Log in to ChatGPT Chatbot Portal'}
        </p>

        {error && (
          <div style={{
            backgroundColor: '#fff2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0d0d0d', marginBottom: '6px' }}>
              Username
            </label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #e5e5e5',
                fontSize: '14px',
                color: '#0d0d0d',
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
              }}
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: isRegisterMode ? '18px' : '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0d0d0d', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  fontSize: '14px',
                  color: '#0d0d0d',
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
                }}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#8e8e8e',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isRegisterMode && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#0d0d0d', marginBottom: '6px' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #e5e5e5',
                    fontSize: '14px',
                    color: '#0d0d0d',
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
                  }}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#10a37f',
              color: '#ffffff',
              border: 'none',
              fontSize: '15px',
              fontWeight: '500',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(16, 163, 127, 0.3)'
            }}
          >
            {loading
              ? (isRegisterMode ? 'Creating account...' : 'Authenticating...')
              : (isRegisterMode ? 'Sign up' : 'Continue')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ marginTop: '20px', fontSize: '13px', color: '#676767' }}>
          {isRegisterMode ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => toggleMode(false)}
                style={{ background: 'none', border: 'none', color: '#10a37f', fontWeight: '600', cursor: 'pointer' }}
              >
                Log in
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => toggleMode(true)}
                style={{ background: 'none', border: 'none', color: '#10a37f', fontWeight: '600', cursor: 'pointer' }}
              >
                Sign up
              </button>
            </span>
          )}
        </div>

        {/* 15m Automatic Session Rotation Notice */}
        <div style={{
          marginTop: '24px',
          padding: '12px 14px',
          backgroundColor: '#f9f9f9',
          border: '1px solid #e5e5e5',
          borderRadius: '10px',
          fontSize: '12px',
          color: '#676767',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textAlign: 'left'
        }}>
          <ShieldCheck size={18} color="#10a37f" style={{ flexShrink: 0 }} />
          <span>
            <strong>Automatic 15m Session Rotation</strong>: Session ID rotates every 15 mins on server automatically without logging out.
          </span>
        </div>

        {!isRegisterMode && (
          <div style={{ marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => { setUsername('admin'); setPassword('password123'); setConfirmPassword(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#10a37f',
                fontSize: '12.5px',
                fontWeight: '500',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Fill Demo Account: admin / password123
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
