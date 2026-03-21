import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChatContext } from '../contexts/ChatContext';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Send, ArrowLeft, Search, ShieldAlert, CheckCheck } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const { channels, sendMessage, markAsRead, getOrCreateChannel } = useChatContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [msgInput, setMsgInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-enrutamiento si venimos de un perfil o reserva específica
  useEffect(() => {
    const targetProId = searchParams.get('proId');
    const targetProName = searchParams.get('proName');
    const targetClientId = searchParams.get('clientId');

    if (targetProId && user.role === 'client') {
      const chId = getOrCreateChannel(user.id, targetProId, user.name, targetProName || 'Profesional');
      setActiveChannelId(chId);
      markAsRead(chId, 'client');
      // Limpiar URL para no re-trigger
      navigate('/chat', { replace: true });
    } else if (targetClientId && user.role === 'pro') {
      const chId = getOrCreateChannel(targetClientId, user.id, 'Cliente Destino', user.name);
      setActiveChannelId(chId);
      markAsRead(chId, 'pro');
      navigate('/chat', { replace: true });
    }
  }, [searchParams, user, getOrCreateChannel, navigate, markAsRead]);

  // Filtrado de canales para el logged user
  const myChannels = channels.filter(ch => user.role === 'pro' ? ch.proId === user.id || ch.proId === '1' : ch.clientId === user.id || ch.clientId === 'usr_dummy');
  const activeChannel = myChannels.find(ch => ch.id === activeChannelId);

  // Auto-scroll al enviar mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChannel?.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !activeChannelId) return;
    sendMessage(activeChannelId, msgInput.trim(), user.id);
    setMsgInput('');
  };

  const selectChannel = (id) => {
    setActiveChannelId(id);
    markAsRead(id, user.role);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', height: 'calc(100vh - 180px)', minHeight: '500px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
      
      {/* INBOX SIDEBAR (Oculto en móvil si hay chat abierto) */}
      <div style={{ width: '100%', maxWidth: '350px', borderRight: '1px solid var(--border-color)', display: activeChannelId ? 'none' : 'flex', flexDirection: 'column', '@media(minWidth: 768px)': { display: 'flex' }, zIndex: 10 }}>
        
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Mensajes</h2>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
            <Search size={18} color="var(--text-muted)" />
            <input type="text" placeholder="Buscar conversación..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', paddingLeft: '0.5rem', fontSize: '0.9rem' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {myChannels.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Aún no tienes mensajes.</p>
          ) : (
            myChannels.map(ch => {
              const unread = user.role === 'pro' ? ch.unreadCountPro : ch.unreadCountClient;
              const targetName = user.role === 'client' ? ch.proName : ch.clientName;
              const targetAvatar = user.role === 'client' ? ch.proAvatar : ch.clientAvatar;
              const isSelected = activeChannelId === ch.id;

              return (
                <button 
                  key={ch.id}
                  onClick={() => selectChannel(ch.id)}
                  style={{ 
                    width: '100%', padding: '1.25rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center', textAlign: 'left',
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent', borderBottom: '1px solid var(--border-color)',
                    borderLeft: isSelected ? '4px solid var(--primary)' : '4px solid transparent', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img src={targetAvatar} alt={targetName} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                    {unread > 0 && <span style={{ position: 'absolute', top:-2, right:-2, backgroundColor:'#EF4444', color:'white', fontSize:'0.7rem', fontWeight:800, width:'20px', height:'20px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'50%', border:'2px solid white' }}>{unread}</span>}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: isSelected || unread > 0 ? 800 : 500, fontSize: '1rem', color: 'var(--text-main)' }}>{targetName}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(ch.lastMessageDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p style={{ margin:0, fontSize: '0.85rem', color: unread > 0 ? 'var(--text-main)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: unread > 0 ? 600 : 400 }}>{ch.lastMessage || 'Empieza a chatear...'}</p>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* ACTIVE CHAT AREA */}
      <div style={{ flex: 1, display: activeChannelId ? 'flex' : 'none', flexDirection: 'column', backgroundColor: '#F9FAFB', '@media(minWidth: 768px)': { display: 'flex' } }}>
        
        {!activeChannel ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>
            <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>Tus Mensajes</h3>
            <p>Selecciona una conversación del panel izquierdo para empezar a chatear.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div style={{ padding: '1.25rem', backgroundColor: 'white', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="mobile-only btn-outline" style={{ padding: '0.5rem', border: 'none', display: 'flex', '@media(minWidth: 768px)': {display:'none'} }} onClick={() => setActiveChannelId(null)}>
                  <ArrowLeft size={20} />
                </button>
                <img src={user.role === 'client' ? activeChannel.proAvatar : activeChannel.clientAvatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{user.role === 'client' ? activeChannel.proName : activeChannel.clientName}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>En línea</span>
                </div>
              </div>
              <button style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#EF4444', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }} title="Reportar comportamiento inadecuado">
                <ShieldAlert size={16} /> <span style={{display: 'none', '@media(minWidth: 640px)': {display:'block'}}}>Reportar</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ textAlign: 'center', margin: '1rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                 <span style={{ backgroundColor: '#E5E7EB', color: '#4B5563', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600 }}>INICIO DE COMUNICACIÓN</span>
                 <p style={{fontSize: '0.8rem', color:'var(--text-muted)', marginTop:'0.5rem', maxWidth:'400px'}}>Por tu seguridad, no compartas datos bancarios, contraseñas o tu dirección exacta hasta tener una reserva confirmada operativamente.</p>
               </div>

               {activeChannel.messages.map(msg => {
                 const isMe = msg.senderId === user.id || msg.senderId === (user.role === 'client' ? 'usr_dummy' : '1');
                 return (
                   <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                     <div style={{ 
                       backgroundColor: isMe ? 'var(--primary)' : 'white', 
                       color: isMe ? 'white' : 'var(--text-main)', 
                       padding: '0.85rem 1.15rem', 
                       borderRadius: isMe ? '18px 18px 0 18px' : '18px 18px 18px 0',
                       boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                       border: isMe ? 'none' : '1px solid var(--border-color)',
                       fontSize: '0.95rem', lineHeight: 1.5
                     }}>
                       {msg.text}
                     </div>
                     <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: isMe ? 'flex-end' : 'flex-start', display:'flex', alignItems:'center', gap:'0.2rem' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        {isMe && <CheckCheck size={12} color="#10B981" />}
                     </span>
                   </div>
                 )
               })}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ padding: '1.25rem', backgroundColor: 'white', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
              <textarea 
                value={msgInput} 
                onChange={e => setMsgInput(e.target.value)} 
                placeholder="Escribe tu mensaje aquí..." 
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                style={{ flex: 1, padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', outline: 'none', resize: 'none', backgroundColor: '#F9FAFB', fontFamily: 'inherit', fontSize: '0.95rem' }} 
                rows={1}
              />
              <button type="submit" className="btn-primary" disabled={!msgInput.trim()} style={{ padding: '1rem', borderRadius: '50%', width:'52px', height:'52px', display:'flex', alignItems:'center', justifyContent:'center', opacity: !msgInput.trim() ? 0.5 : 1 }}>
                <Send size={20} style={{marginLeft:'2px'}} />
              </button>
            </form>
          </>
        )}
      </div>

    </div>
  );
}
