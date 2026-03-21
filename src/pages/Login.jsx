import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!email || !pass) return alert("Rellena todos los campos");
    setIsSubmitting(true);
    
    // MVP logic: si el email contiene "pro", le damos rol de profesional
    const assumedRole = email.includes('pro') ? 'pro' : 'client';
    const usr = await login(email, pass, assumedRole);
    setIsSubmitting(false);
    
    // Redirección condicionada por Onboarding y Rol
    if (!usr.onboarded) {
      navigate('/onboarding');
    } else {
      navigate(assumedRole === 'pro' ? '/dashboard' : '/');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2.5rem', borderRadius: 'var(--radius-lg)' }} className="glass-panel">
      <h2 style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '1.75rem', fontWeight: 700 }}>Iniciar Sesión</h2>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Correo</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com" style={{ width: '100%', padding: '0.9rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', outline: 'none' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Contraseña</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '0.9rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', outline: 'none' }} />
        </div>
        
        <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '1rem', marginTop: '1rem', fontSize: '1rem' }}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', backgroundColor: 'var(--primary-light)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
        Tip MVP: Para probar como "Profesional", usa un correo que contenga la palabra "pro".
      </p>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem' }}>
        ¿No tienes cuenta? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Crea una gratis</Link>
      </p>
    </div>
  );
}
