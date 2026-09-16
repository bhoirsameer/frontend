import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatFeed from './ChatFeed';
import InputBox from './InputBox';
import WelcomeScreen from './WelcomeScreen';
import SessionModal from './SessionModal';
import { api } from '../services/api';
import { CheckCircle2 } from 'lucide-react';

// URL Helper utilities to keep active chat ID in URL query parameter
const getChatIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('chat_id') || params.get('c') || null;
};

const updateUrlWithChatId = (chatId) => {
  const url = new URL(window.location.href);
  if (chatId) {
    url.searchParams.set('chat_id', chatId);
  } else {
    url.searchParams.delete('chat_id');
  }
  window.history.pushState({}, '', url.pathname + url.search);
};

export default function Chat({ username, sessionInfo, rotationNotice, onLogout, onTestRotate }) {
  const [messages, setMessages] = useState([]);
  const [threads, setThreads] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    loadThreadsAndInitialHistory();

    const handlePopState = () => {
      const urlChatId = getChatIdFromUrl();
      setActiveChatId(urlChatId);
      if (urlChatId) {
        loadChatHistory(urlChatId);
      } else {
        setMessages([]);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadThreadsAndInitialHistory = async () => {
    try {
      const threadsRes = await api.getThreads();
      const userThreads = threadsRes?.threads || [];
      setThreads(userThreads);

      const urlChatId = getChatIdFromUrl();
      if (urlChatId) {
        setActiveChatId(urlChatId);
        await loadChatHistory(urlChatId);
      } else {
        setActiveChatId(null);
        setMessages([]);
      }
    } catch (e) {
      console.error('Error loading threads:', e);
    }
  };

  const loadChatHistory = async (chatId) => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    try {
      const data = await api.getHistory(chatId);
      if (data?.history) {
        setMessages(data.history);
      } else {
        setMessages([]);
      }
    } catch (e) {
      console.error('Error loading history for chat:', chatId, e);
    }
  };

  const handleSelectChat = async (chatId) => {
    setActiveChatId(chatId);
    updateUrlWithChatId(chatId);
    await loadChatHistory(chatId);
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    updateUrlWithChatId(null);
    setMessages([]);
  };

  const handleDeleteThread = async (chatIdToDelete) => {
    if (!chatIdToDelete) return;
    try {
      await api.deleteThread(chatIdToDelete);
      if (chatIdToDelete === activeChatId) {
        handleNewChat();
      }
      await refreshThreads();
    } catch (err) {
      console.error('Error soft-deleting thread:', err);
    }
  };

  const refreshThreads = async (currentChatId) => {
    try {
      const res = await api.getThreads();
      if (res?.threads) {
        setThreads(res.threads);
      }
    } catch (e) {
      console.error('Error refreshing threads:', e);
    }
  };

  const handleSend = async (textToSend) => {
    const msg = textToSend || input;
    if (!msg.trim() || loading) return;

    const userMessage = { role: 'user', content: msg };
    // Empty placeholder that gets filled in token-by-token as the reply streams in.
    const assistantMessage = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
    setLoading(true);

    const appendToAssistant = (piece) => {
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, content: last.content + piece };
        return next;
      });
    };

    let streamedChatId = activeChatId;

    await api.sendMessageStream(msg, activeChatId, {
      onStart: ({ chat_id }) => {
        streamedChatId = chat_id;
        if (chat_id && chat_id !== activeChatId) {
          setActiveChatId(chat_id);
          updateUrlWithChatId(chat_id);
        }
      },
      onToken: (piece) => {
        appendToAssistant(piece);
      },
      onDone: async () => {
        setLoading(false);
        // Refresh sidebar threads list to reflect the new or updated chat
        await refreshThreads(streamedChatId);
      },
      onError: (err) => {
        appendToAssistant(`\n\nError: ${err.message || 'Failed to send'}`);
        setLoading(false);
      }
    });
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#ffffff',
      overflow: 'hidden'
    }}>
      {/* ChatGPT Left Sidebar */}
      <Sidebar
        username={username}
        threads={threads}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteThread={handleDeleteThread}
        onOpenSessionModal={() => setSessionModalOpen(true)}
      />

      {/* Right Main Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}>
        {/* Top Navbar */}
        <Navbar
          onOpenSessionModal={() => setSessionModalOpen(true)}
        />

        {/* Rotation Toast Notice Banner */}
        {rotationNotice && (
          <div style={{
            position: 'absolute',
            top: '64px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#10a37f',
            color: '#ffffff',
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '12.5px',
            fontWeight: '500',
            boxShadow: '0 4px 14px rgba(16, 163, 127, 0.35)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} />
            Server automatically rotated Session ID. You remain logged in seamlessly!
          </div>
        )}

        {messages.length === 0 ? (
          <WelcomeScreen
            input={input}
            setInput={setInput}
            onSend={handleSend}
            loading={loading}
          />
        ) : (
          <>
            {/* Chat Stream / Feed */}
            <ChatFeed
              messages={messages}
              loading={loading && messages[messages.length - 1]?.content === ''}
              endRef={endRef}
            />

            {/* Input Capsule Box */}
            <InputBox
              input={input}
              setInput={setInput}
              onSend={() => handleSend()}
              loading={loading}
            />
          </>
        )}
      </div>

      {/* Session Details Settings Modal */}
      <SessionModal
        isOpen={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        sessionId={sessionInfo.sessionId}
        secondsUntilRotation={sessionInfo.secondsUntilRotation}
        onTestRotate={onTestRotate}
        onLogout={onLogout}
      />
    </div>
  );
}
