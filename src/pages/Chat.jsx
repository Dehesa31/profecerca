import { useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hola, vi que reservaste para mañana.', sender: 'pro', time: '10:00' },
    { id: 2, text: '¡Sí! ¿Llevo mi propia raqueta?', sender: 'me', time: '10:05' },
    { id: 3, text: 'Si tienes sí, si no, yo te presto una sin problema.', sender: 'pro', time: '10:06' },
  ]);
  const [input, setInput] = useState('');

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'me', time: new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'}) }]);
    setInput('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', height: 'calc(100vh - 12rem)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
      <header style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--primary-light)' }}>
        <Link to="/dashboard" style={{ color: 'var(--text-main)', padding: '0.5rem' }}><ArrowLeft size={20} /></Link>
        <img src="https://i.pravatar.cc/150?u=1" alt="Pro" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        <div>
          <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>Carlos Martín</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pro de Pádel</p>
        </div>
      </header>

      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-color)' }}>
        {messages.map(m => (
          <div key={m.id} style={{ alignSelf: m.sender === 'me' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            <div style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: m.sender === 'me' ? 'var(--primary)' : 'var(--surface)', 
              color: m.sender === 'me' ? 'white' : 'var(--text-main)',
              border: m.sender === 'me' ? 'none' : '1px solid var(--border-color)',
              borderBottomRightRadius: m.sender === 'me' ? '0' : 'var(--radius-md)',
              borderBottomLeftRadius: m.sender === 'me' ? 'var(--radius-md)' : '0'
            }}>
              {m.text}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textAlign: m.sender === 'me' ? 'right' : 'left', marginTop: '0.25rem' }}>
              {m.time}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={send} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', backgroundColor: 'var(--surface)' }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', outline: 'none' }}
        />
        <button type="submit" className="btn-primary" style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0 }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
