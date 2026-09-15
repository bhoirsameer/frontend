import React, { useState } from 'react';
import { X, ShieldCheck, Copy, Check, RefreshCw } from 'lucide-react';

export default function SessionModal({ isOpen, onClose, sessionId, secondsUntilRotation, onTestRotate }) {
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTestRotate = async () => {
    setTesting(true);
    try {
      await onTestRotate();
    } finally {
      setTesting(false);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e5e5'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#e6f7f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={20} color="#10a37f" />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#0d0d0d' }}>
                Session & Security Settings
              </h3>
              <p style={{ fontSize: '12px', color: '#676767' }}>
                Automatic 15-Minute Session Rotation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#676767', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Current Session ID */}
          <div style={{
            backgroundColor: '#f9f9f9',
            border: '1px solid #e5e5e5',
            borderRadius: '10px',
            padding: '12px 14px'
          }}>
            <div style={{ fontSize: '12px', color: '#676767', marginBottom: '6px', fontWeight: '500' }}>
              Active Session ID:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <code style={{ fontSize: '13px', color: '#0d0d0d', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                {sessionId || 'No Active Session'}
              </code>
              <button
                onClick={handleCopy}
                title="Copy Session ID"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#0d0d0d',
                  flexShrink: 0,
                  marginLeft: '8px'
                }}
              >
                {copied ? <Check size={14} color="#10a37f" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* 15m Countdown Bar */}
          <div style={{
            backgroundColor: '#f9f9f9',
            border: '1px solid #e5e5e5',
            borderRadius: '10px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#0d0d0d' }}>
                Next Server Rotation
              </div>
              <div style={{ fontSize: '11.5px', color: '#676767' }}>
                Session ID changes automatically every 15 minutes
              </div>
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#10a37f',
              fontFamily: 'monospace',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e5e5',
              padding: '6px 12px',
              borderRadius: '8px'
            }}>
              {formatTimer(secondsUntilRotation)}
            </div>
          </div>

          {/* Manual Test Rotate Button */}
          <button
            onClick={handleTestRotate}
            disabled={testing}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '8px',
              backgroundColor: '#0d0d0d',
              color: '#ffffff',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: '500',
              cursor: testing ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px'
            }}
          >
            <RefreshCw size={15} style={{ animation: testing ? 'spin 1s linear infinite' : 'none' }} />
            {testing ? 'Rotating Session...' : 'Test Instant Session Rotation'}
          </button>
        </div>
      </div>
    </div>
  );
}
