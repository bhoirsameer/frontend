import React, { useState } from 'react';
import {
  PanelLeftClose, PanelLeftOpen, SquarePen, Search, Image as ImageIcon,
  LibraryBig, Clock, Blocks, FolderClosed, MoreHorizontal, MessageSquare, Trash2
} from 'lucide-react';

function NavRow({ icon, label, badge, onClick }) {
  const Icon = icon;
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 8px',
        borderRadius: '8px',
        background: 'none',
        border: 'none',
        color: '#0d0d0d',
        fontSize: '13.5px',
        fontWeight: '500',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.15s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ececec'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <Icon size={17} color="#0d0d0d" />
      <span>{label}</span>
      {badge && (
        <span style={{
          fontSize: '9px',
          fontWeight: '700',
          color: '#5a5af0',
          backgroundColor: '#ecebff',
          padding: '2px 5px',
          borderRadius: '4px',
          letterSpacing: '0.3px'
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

export default function Sidebar({ username, threads = [], activeChatId, onSelectChat, onNewChat, onDeleteThread, onOpenSessionModal }) {
  const userInitial = username ? username.charAt(0).toUpperCase() : 'U';
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <aside style={{
        width: '56px',
        backgroundColor: '#f9f9f9',
        borderRight: '1px solid #e5e5e5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        padding: '12px 0',
        gap: '10px',
        userSelect: 'none'
      }}>
        <button
          onClick={() => setCollapsed(false)}
          title="Open sidebar"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0d0d0d', padding: '8px', borderRadius: '8px', display: 'flex' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ececec'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <PanelLeftOpen size={20} />
        </button>
        <button
          onClick={onNewChat}
          title="New chat"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0d0d0d', padding: '8px', borderRadius: '8px', display: 'flex' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ececec'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <SquarePen size={20} />
        </button>
      </aside>
    );
  }

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '15px', fontWeight: '700', color: '#0d0d0d', padding: '6px 8px' }}>
          ChatGPT
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <button
            title="Search chats"
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
            <Search size={17} />
          </button>

          <button
            onClick={() => setCollapsed(true)}
            title="Close sidebar"
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
            <PanelLeftClose size={18} />
          </button>
        </div>
      </div>

      {/* Primary Nav Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '14px' }}>
        <NavRow icon={SquarePen} label="New chat" onClick={onNewChat} />
        <NavRow icon={ImageIcon} label="Images" badge="UPDATED" onClick={() => {}} />
        <NavRow icon={LibraryBig} label="Library" onClick={() => {}} />
        <NavRow icon={Clock} label="Scheduled" onClick={() => {}} />
        <NavRow icon={Blocks} label="Plugins" onClick={() => {}} />
        <NavRow icon={FolderClosed} label="Projects" onClick={() => {}} />
        <NavRow icon={MoreHorizontal} label="More" onClick={() => {}} />
      </div>

      {/* Recents Section */}
      <div style={{ fontSize: '11px', fontWeight: '600', color: '#8e8e8e', padding: '0 8px', marginBottom: '8px' }}>
        Recents
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
                  justifyContent: 'space-between',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: 1 }}>
                  <MessageSquare size={15} color={isActive ? '#10a37f' : '#8e8e8e'} style={{ flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {thread.title || 'Chat Session'}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDeleteThread) {
                      onDeleteThread(thread.chat_id);
                    }
                  }}
                  title="Delete conversation (Soft delete)"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#8e8e8e',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.7,
                    flexShrink: 0,
                    transition: 'opacity 0.15s ease, color 0.15s ease, background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.style.color = '#8e8e8e';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* User Row Footer */}
      <div
        onClick={onOpenSessionModal}
        title="Session & account settings"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 10px',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ececec'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: '#d9d9e3',
          color: '#0d0d0d',
          fontWeight: '600',
          fontSize: '12.5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {userInitial}
        </div>
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0d0d0d', lineHeight: 1.3 }}>
            {username}
          </div>
          <div style={{ fontSize: '11.5px', color: '#8e8e8e' }}>
            Free
          </div>
        </div>
      </div>
    </aside>
  );
}
