import React, { useState, useEffect } from 'react';
import { ChevronDown, Share2, LogOut, ShieldCheck, Sparkles } from 'lucide-react';

export default function Navbar({ username, sessionId, secondsUntilRotation, onLogout, onOpenSessionModal }) {
  const [timer, setTimer] = useState(secondsUntilRotation || 900);

  useEffect(() => {
    setTimer(secondsUntilRotation);
  }, [secondsUntilRotation, sessionId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const userInitial = username ? username.charAt(0).toUpperCase() : 'U';

  return (
    <header style={{
      height: '56px',
      padding: '0 16px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #0000000d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Model Selector Dropdown Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          fontSize: '18px',
          fontWeight: '600',
          color: '#0d0d0d',
          cursor: 'pointer',
          padding: '6px 10px',
          borderRadius: '8px',
          transition: 'background-color 0.15s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span>ChatGPT</span>
          <span style={{ fontSize: '14px', color: '#676767', fontWeight: '500' }}>4o</span>
          <ChevronDown size={16} color="#676767" />
        </button>
      </div>

      {/* Right Action Icons & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Session Security Pill Button */}
        <button
          onClick={onOpenSessionModal}
          title="Click to view 15-Minute Session Details & Settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f4f4f4',
            border: '1px solid #e5e5e5',
            borderRadius: '999px',
            padding: '5px 12px',
            fontSize: '12px',
            color: '#0d0d0d',
            cursor: 'pointer',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ececec'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f4f4f4'}
        >
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#10a37f'
          }} />
          <span>Session Active</span>
          <span style={{ color: '#676767', fontFamily: 'monospace' }}>({formatTimer(timer)})</span>
        </button>

        {/* Share Button */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '999px',
          border: '1px solid #e5e5e5',
          backgroundColor: '#ffffff',
          color: '#0d0d0d',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          <Share2 size={14} color="#676767" />
          Share
        </button>

        {/* User Profile Circle & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#10a37f',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {userInitial}
          </div>

          <button
            onClick={onLogout}
            title="Log out"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#676767',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
