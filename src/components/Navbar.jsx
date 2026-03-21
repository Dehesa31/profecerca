import { Link } from 'react-router-dom';
import { Menu, Search, User, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChatContext } from '../contexts/ChatContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { channels } = useChatContext();

  const getUnreadCount = () => {
    if (!user) return 0;
    return channels.reduce((acc, ch) => {
      if (user.role === 'pro' && ch.proId === '1') return acc + ch.unreadCountPro;
      if (user.role === 'client' && (ch.clientId === user.id || ch.clientId === 'usr_dummy')) return acc + ch.unreadCountClient;
      return acc;
    }, 0);
  };

  const unreadTotal = getUnreadCount();

  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            P
          </div>
          ProfeCerca
        </Link>
        
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/" className="btn-outline" style={{ border: 'none', padding: '0.5rem' }}>
            <Search size={20} />
          </Link>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {user.role === 'pro' && (
                <Link to="/agenda" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', display: 'none', '@media(minWidth: 640px)': { display: 'block' } }}>Agenda</Link>
              )}
              <Link to="/dashboard" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', display: 'none', '@media(minWidth: 640px)': { display: 'block' } }}>Reservas</Link>
              
              <Link to="/chat" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                <MessageSquare size={22} />
                {unreadTotal > 0 && <span style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#EF4444', color: 'white', fontSize: '0.65rem', fontWeight: 800, width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>{unreadTotal}</span>}
              </Link>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
                <img src={user.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <span style={{ fontWeight: 500, fontSize: '0.9rem', display: 'none', '@media(minWidth: 640px)': { display: 'block' } }}>
                  {user.name.split(' ')[0]}
                </span>
              </div>
              <button className="btn-outline" onClick={logout} style={{ border: 'none', padding: '0.25rem', color: 'var(--text-muted)' }} title="Salir">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link to="/login" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none' }}>
                <span style={{ fontWeight: 500 }}>Entrar</span>
              </Link>
              <Link to="/register" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 500 }}>Regístrate</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
