import React from 'react';
import { Plus, ArrowUp, Mic, Globe } from 'lucide-react';

export default function InputBox({ input, setInput, onSend, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const hasContent = input.trim().length > 0;

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 16px 16px 16px',
      backgroundColor: '#ffffff'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '768px',
        position: 'relative'
      }}>
        {/* ChatGPT Input Capsule */}
        <div className="chatgpt-input-capsule" style={{
          display: 'flex',
          alignItems: 'flex-end',
          padding: '10px 14px',
          gap: '8px'
        }}>
          {/* Plus icon button */}
          <button
            type="button"
            title="Attach or tools"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#f4f4f4',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0d0d0d',
              flexShrink: 0
            }}
          >
            <Plus size={18} />
          </button>

          {/* Search/Reason button pill */}
          <button
            type="button"
            title="Web search"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '999px',
              backgroundColor: '#f4f4f4',
              border: 'none',
              color: '#676767',
              fontSize: '12.5px',
              fontWeight: '500',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <Globe size={14} />
            <span>Search</span>
          </button>

          {/* Textarea Input */}
          <textarea
            rows={1}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '15px',
              color: '#0d0d0d',
              resize: 'none',
              padding: '4px 6px',
              maxHeight: '160px',
              lineHeight: '1.5'
            }}
            placeholder="Message ChatGPT..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Mic icon */}
          <button
            type="button"
            title="Voice input"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#676767',
              flexShrink: 0
            }}
          >
            <Mic size={18} />
          </button>

          {/* Send Arrow Circle */}
          <button
            type="button"
            onClick={onSend}
            disabled={!hasContent || loading}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: hasContent && !loading ? '#0d0d0d' : '#e5e5e5',
              color: '#ffffff',
              border: 'none',
              cursor: hasContent && !loading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background-color 0.15s ease'
            }}
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div style={{
        fontSize: '12px',
        color: '#8e8e8e',
        marginTop: '8px',
        textAlign: 'center'
      }}>
        ChatGPT can make mistakes. Check important info. • Server automatically rotates Session ID every 15 mins.
      </div>
    </div>
  );
}
