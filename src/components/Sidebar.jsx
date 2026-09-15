import React from 'react';
import { Bot, SquarePen, Sparkles, MessageSquare, ShieldCheck, ChevronRight, Plus } from 'lucide-react';

export default function Sidebar({ username, threads = [], activeChatId, onSelectChat, onNewChat, onOpenSessionModal }) {
  const userInitial = username ? username.charAt(0).toUpperCase() : 'U';

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#f9f9f9',
      borderRight: '1px solid #e5e5e5',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '12px',
      userSelect: 'none'
    }}>
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button
          onClick={onNewChat}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            fontSize: '15px',
            fontWeight: '600',
            color: '#0d0d0d',
            cursor: 'pointer',
            padding: '6px 8px',
            borderRadius: '8px'
          }}
        >
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: '#10a37f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={16} color="#ffffff" />
          </div>
          <span>ChatGPT</span>
        </button>

        <button
          onClick={onNewChat}
          title="New chat"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#676767',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ececec'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <SquarePen size={18} />
        </button>
      </div>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        style={{
          width: '100%',
          padding: '9px 12px',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e5e5',
          color: '#0d0d0d',
          fontSize: '13.5px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          marginBottom: '16px',
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f4f4f4';
          e.currentTarget.style.borderColor = '#d9d9d9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.borderColor = '#e5e5e5';
        }}
      >
        <Plus size={16} color="#10a37f" />
        <span>New chat</span>
      </button>

      {/* Recent Chats Section */}
      <div style={{ fontSize: '11px', fontWeight: '600', color: '#8e8e8e', padding: '0 8px', marginBottom: '8px' }}>
        Recent Chats
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {threads.length === 0 ? (
          <div style={{ padding: '10px 8px', fontSize: '12.5px', color: '#8e8e8e', fontStyle: 'italic' }}>
            No recent chats yet
          </div>
        ) : (
          threads.map((thread) => {
            const isActive = thread.chat_id === activeChatId;
            return (
              <div
                key={thread.chat_id}
                onClick={() => onSelectChat(thread.chat_id)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? '#ececec' : 'transparent',
                  color: isActive ? '#0d0d0d' : '#4a4a4a',
                  fontSize: '13.5px',
                  fontWeight: isActive ? '600' : '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <MessageSquare size={15} color={isActive ? '#10a37f' : '#8e8e8e'} style={{ flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                  {thread.title || 'Chat Session'}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Upgrade Plan Card */}
      <button
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '10px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e5e5',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          marginBottom: '12px',
          textAlign: 'left',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: '#f3e8ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sparkles size={16} color="#a855f7" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#0d0d0d' }}>Upgrade plan</div>
          <div style={{ fontSize: '11px', color: '#676767' }}>Get GPT-4o, DALL·E & more</div>
        </div>
      </button>

      {/* User Row Footer */}
      <div
        onClick={onOpenSessionModal}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ececec'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0d0d0d', lineHeight: 1.2 }}>
              {username}
            </div>
            <div style={{ fontSize: '11px', color: '#10a37f', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <ShieldCheck size={11} /> 15m Auto Rotation
            </div>
          </div>
        </div>
        <ChevronRight size={16} color="#8e8e8e" />
      </div>
    </aside>
  );
}
