import { Link } from 'react-router-dom';
import { Menu, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src={user.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <span style={{ fontWeight: 500, fontSize: '0.9rem', display: 'none', '@media(minWidth: 640px)': { display: 'block' } }}>
                  {user.name.split(' ')[0]}
                </span>
              </div>
              <button className="btn-outline" onClick={logout} style={{ border: 'none', padding: '0.5rem', color: 'var(--text-muted)' }} title="Salir">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} />
              <span style={{ display: 'none', '@media(minWidth: 640px)': { display: 'block' } }}>Ingresar</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
