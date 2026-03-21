import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }} className="glass-panel">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 600 }}>Iniciar Sesión</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          className="btn-primary" 
          onClick={() => handleLogin('client')}
          style={{ width: '100%', padding: '1rem' }}
        >
          Entrar como Cliente
        </button>
        
        <button 
          className="btn-outline" 
          onClick={() => handleLogin('pro')}
          style={{ width: '100%', padding: '1rem' }}
        >
          Entrar como Profesional
        </button>
      </div>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        (Modo MVP: Autenticación simulada)
      </p>
    </div>
  );
}
