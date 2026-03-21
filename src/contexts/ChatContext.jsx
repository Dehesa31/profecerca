import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user } = useAuth();
  
  // Listado de canales simulando una tabla de Base de Datos
  const [channels, setChannels] = useState([
    {
      id: 'ch_1',
      clientId: 'usr_dummy', // ID MOCK del client base
      proId: '1',            // ID MOCK del pro base
      clientName: 'Marta (Cliente)',
      proName: 'Carlos Martín',
      proAvatar: 'https://i.pravatar.cc/150?u=1',
      clientAvatar: 'https://i.pravatar.cc/150?u=client',
      lastMessage: 'Me parece genial, llevo entonces mi propia esterilla.',
      lastMessageDate: new Date().toISOString(),
      unreadCountPro: 1,
      unreadCountClient: 0,
      messages: [
        { id: 1, senderId: 'usr_dummy', text: '¡Hola Carlos! Una duda antes de reservar el viernes, ¿las clases particulares en mi domicilio incluyen que traigas material o pongo yo el material deportivo?', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 2, senderId: '1', text: '¡Hola Marta! Generalmente yo llevo cintas mecánicas e indumentaria de entreno. ¿Te parece bien si tú pones únicamente la esterilla base por temas de higiene?', timestamp: new Date(Date.now() - 3000000).toISOString() },
        { id: 3, senderId: 'usr_dummy', text: 'Me parece genial, llevo entonces mi propia esterilla.', timestamp: new Date().toISOString() }
      ]
    }
  ]);

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
    const existing = channels.find(ch => ch.clientId === clientId && ch.proId === proId);
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

  return (
    <ChatContext.Provider value={{ channels, sendMessage, markAsRead, getOrCreateChannel }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => useContext(ChatContext);
