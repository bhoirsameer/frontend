import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lang = language ? language.toLowerCase() : '';

  return (
    <div style={{
      margin: '16px 0',
      borderRadius: '10px',
      overflow: 'hidden',
      border: '1px solid #2d2d2d',
      backgroundColor: '#0d0d0d',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }}>
      {/* ChatGPT Style Code Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '9px 16px',
        backgroundColor: '#212121',
        borderBottom: '1px solid #2c2c2c',
        color: '#b4b4b4',
        fontSize: '12px',
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontWeight: '500'
      }}>
        <span style={{ textTransform: 'lowercase', letterSpacing: '0.2px' }}>{lang || 'code'}</span>
        <button
          onClick={handleCopyCode}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: copied ? '#10a37f' : (isHovered ? '#ffffff' : '#b4b4b4'),
            cursor: 'pointer',
            fontSize: '12px',
            padding: '2px 4px',
            borderRadius: '4px',
            transition: 'color 0.15s ease'
          }}
        >
          {copied ? <Check size={14} color="#10a37f" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy code'}</span>
        </button>
      </div>

      {/* Code Body with ChatGPT Pure Black Background */}
      <SyntaxHighlighter
        language={lang || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '16px',
          backgroundColor: '#0d0d0d',
          fontSize: '13.5px',
          lineHeight: '1.6',
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          borderRadius: 0,
          border: 'none',
          overflowX: 'auto'
        }}
        codeTagProps={{
          style: {
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            fontSize: '13.5px'
          }
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function FormattedMessage({ content, isUser }) {
  if (isUser) {
    return (
      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {content}
      </div>
    );
  }

  // Pre-process markdown to clean up common raw formatting quirks if any
  const sanitizedContent = content ? content.replace(/\\n/g, '\n') : '';

  return (
    <div className="formatted-markdown-container" style={{ fontSize: '15px', color: '#0d0d0d', lineHeight: '1.65' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          table: ({ node, ...props }) => (
            <div style={{
              overflowX: 'auto',
              margin: '16px 0',
              borderRadius: '10px',
              border: '1px solid #e5e5e5',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
              maxWidth: '100%'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
                textAlign: 'left',
                backgroundColor: '#ffffff'
              }} {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead style={{
              backgroundColor: '#f7f7f8',
              borderBottom: '2px solid #e5e5e5',
              fontWeight: '600'
            }} {...props} />
          ),
          th: ({ node, ...props }) => (
            <th style={{
              padding: '10px 14px',
              color: '#0d0d0d',
              fontWeight: '600',
              borderRight: '1px solid #ebebeb'
            }} {...props} />
          ),
          td: ({ node, ...props }) => (
            <td style={{
              padding: '10px 14px',
              borderBottom: '1px solid #f0f0f0',
              borderRight: '1px solid #ebebeb',
              color: '#2d2d2d',
              verticalAlign: 'top'
            }} {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr style={{
              transition: 'background-color 0.1s ease'
            }} className="table-row-stripe" {...props} />
          ),
          pre: ({ children }) => <>{children}</>,
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            const isInline = inline || (!match && !codeString.includes('\n') && node?.parent?.tagName !== 'pre');

            if (isInline) {
              return (
                <code style={{
                  backgroundColor: '#f4f4f5',
                  color: '#18181b',
                  padding: '2px 6px',
                  borderRadius: '5px',
                  fontSize: '13.5px',
                  fontFamily: "'JetBrains Mono', monospace",
                  border: '1px solid #e4e4e7',
                  wordBreak: 'break-word'
                }} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <CodeBlock code={codeString} language={match ? match[1] : ''} />
            );
          },
          h1: ({ node, ...props }) => (
            <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '20px 0 10px', color: '#0d0d0d', letterSpacing: '-0.01em' }} {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '16px 0 8px', color: '#0d0d0d', letterSpacing: '-0.01em' }} {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '14px 0 6px', color: '#0d0d0d' }} {...props} />
          ),
          p: ({ node, ...props }) => (
            <p style={{ margin: '0 0 12px 0', lineHeight: '1.65' }} {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul style={{ margin: '0 0 12px 0', paddingLeft: '22px', lineHeight: '1.65' }} {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol style={{ margin: '0 0 12px 0', paddingLeft: '22px', lineHeight: '1.65' }} {...props} />
          ),
          li: ({ node, ...props }) => (
            <li style={{ marginBottom: '4px' }} {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote style={{
              borderLeft: '4px solid #10a37f',
              paddingLeft: '14px',
              margin: '12px 0',
              color: '#4a4a4a',
              fontStyle: 'italic',
              backgroundColor: '#f7faf9',
              paddingTop: '8px',
              paddingBottom: '8px',
              borderRadius: '0 6px 6px 0'
            }} {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', margin: '20px 0' }} {...props} />
          )
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
}
