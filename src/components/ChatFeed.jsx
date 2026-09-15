import React from 'react';
import { Bot, User, Copy, ThumbsUp, ThumbsDown, RotateCcw, Check, Code, PenTool, Lightbulb, Compass } from 'lucide-react';
import FormattedMessage from './FormattedMessage';

export default function ChatFeed({ messages, loading, onSend, endRef }) {
  const [copiedIndex, setCopiedIndex] = React.useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const samplePrompts = [
    { title: "Code session authentication", subtitle: "Write FastAPI session & 15m rotation logic", icon: Code },
    { title: "Summarize text or article", subtitle: "Extract key takeaways in bullet points", icon: PenTool },
    { title: "Explain sliding sessions", subtitle: "How automatic 15-minute token rotation works", icon: Lightbulb },
    { title: "Design a React component", subtitle: "Create an interactive ChatGPT clone UI", icon: Compass }
  ];

  if (messages.length === 0) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        textAlign: 'center'
      }}>
        {/* ChatGPT Logo Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#10a37f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: '0 4px 16px rgba(16, 163, 127, 0.25)'
        }}>
          <Bot size={32} color="#ffffff" />
        </div>

        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#0d0d0d',
          marginBottom: '36px',
          letterSpacing: '-0.02em'
        }}>
          What can I help with today?
        </h2>

        {/* 2x2 Grid Prompt Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          width: '100%',
          maxWidth: '680px'
        }}>
          {samplePrompts.map((item, i) => {
            const IconComp = item.icon;
            return (
              <div
                key={i}
                className="chatgpt-card"
                onClick={() => onSend(item.title)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <IconComp size={16} color="#10a37f" />
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0d0d0d' }}>
                    {item.title}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#676767' }}>
                  {item.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '768px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '16px',
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isUser ? '#0d0d0d' : '#10a37f',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {isUser ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Content Bubble & Action Bar */}
              <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{
                  backgroundColor: isUser ? '#f4f4f4' : 'transparent',
                  padding: isUser ? '10px 16px' : '2px 0',
                  borderRadius: isUser ? '20px' : '0',
                  color: '#0d0d0d',
                  fontSize: '15px',
                  lineHeight: '1.6'
                }}>
                  <FormattedMessage content={msg.content} isUser={isUser} />
                </div>

                {/* Assistant Message Actions Bar */}
                {!isUser && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', color: '#8e8e8e' }}>
                    <button
                      onClick={() => handleCopy(msg.content, index)}
                      title="Copy response"
                      style={{ background: 'none', border: 'none', color: '#8e8e8e', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                    >
                      {copiedIndex === index ? <Check size={14} color="#10a37f" /> : <Copy size={14} />}
                    </button>
                    <button title="Good response" style={{ background: 'none', border: 'none', color: '#8e8e8e', cursor: 'pointer', padding: '4px' }}>
                      <ThumbsUp size={14} />
                    </button>
                    <button title="Bad response" style={{ background: 'none', border: 'none', color: '#8e8e8e', cursor: 'pointer', padding: '4px' }}>
                      <ThumbsDown size={14} />
                    </button>
                    <button title="Regenerate" style={{ background: 'none', border: 'none', color: '#8e8e8e', cursor: 'pointer', padding: '4px' }}>
                      <RotateCcw size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#10a37f',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={16} />
            </div>
            <div style={{ color: '#8e8e8e', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}
