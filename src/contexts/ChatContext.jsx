import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user } = useAuth();
  
  const [channelsState, setChannelsState] = useState(() => JSON.parse(localStorage.getItem('profecerca_channels') || '[]'));

  const setChannels = (updater) => {
     setChannelsState(prev => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        localStorage.setItem('profecerca_channels', JSON.stringify(next));
        return next;
     });
  };

  const sendMessage = (channelId, text, senderId) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id === channelId) {
        return {
          ...ch,
          lastMessage: text,
          lastMessageDate: new Date().toISOString(),
          unreadCountPro: senderId === ch.clientId ? ch.unreadCountPro + 1 : 0,
          unreadCountClient: senderId === ch.proId ? ch.unreadCountClient + 1 : 0,
          messages: [...ch.messages, { id: Date.now(), senderId, text, timestamp: new Date().toISOString() }]
        };
      }
      return ch;
    }));
  };

  const markAsRead = (channelId, role) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id === channelId) {
        return {
          ...ch,
          unreadCountPro: role === 'pro' ? 0 : ch.unreadCountPro,
          unreadCountClient: role === 'client' ? 0 : ch.unreadCountClient
        };
      }
      return ch;
    }));
  };

  const getOrCreateChannel = (clientId, proId, clientName, proName, clientAvg, proAvg) => {
    const existing = channelsState.find(ch => ch.clientId === clientId && ch.proId === proId);
    if (existing) return existing.id;
    
    // Si no han hablado nunca, se les crea un "túnel" de chat
    const newId = `ch_${Date.now()}`;
    setChannels(prev => [{
      id: newId, 
      clientId, 
      proId, 
      clientName: clientName || 'Nuevo Cliente', 
      proName: proName || 'Profesional', 
      proAvatar: proAvg || `https://i.pravatar.cc/150?u=${proId}`,
      clientAvatar: clientAvg || `https://i.pravatar.cc/150?u=${clientId}`,
      lastMessage: '', 
      lastMessageDate: new Date().toISOString(), 
      unreadCountPro: 0, 
      unreadCountClient: 0, 
      messages: []
    }, ...prev]);
    return newId;
  };

  // Pasar explicitamente channelsState en el proveedor pero como 'channels'
  return (
    <ChatContext.Provider value={{ channels: channelsState, sendMessage, markAsRead, getOrCreateChannel }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => useContext(ChatContext);
