import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Briefcase, Mail, Lock } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!name || !email || !pass) return alert("Rellena todos los campos");
    
    setIsSubmitting(true);
    const res = await register({ name, email, password: pass, role });
    setIsSubmitting(false);
    
    if(!res.success) return alert(res.error || "Error al registrar");

    // Una vez registrado, se envía al workflow de Onboarding para extender el perfil
    navigate('/onboarding');
  };

  return (
    <div style={{ maxWidth: '500px', margin: '3rem auto', padding: '2.5rem', borderRadius: 'var(--radius-lg)' }} className="glass-panel">
      <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: 800 }}>Crear Cuenta</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>Elige cómo quieres usar la plataforma</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          type="button"
          onClick={() => setRole('client')}
          style={{ 
            padding: '1.5rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            border: role === 'client' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
            backgroundColor: role === 'client' ? 'var(--primary-light)' : 'var(--surface)',
            color: role === 'client' ? 'var(--primary-hover)' : 'var(--text-main)',
            transition: 'all 0.2s'
          }}
        >
          <User size={28} />
          <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Soy Cliente</span>
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Quiero aprender</span>
        </button>

        <button 
          type="button"
          onClick={() => setRole('pro')}
          style={{ 
            padding: '1.5rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            border: role === 'pro' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
            backgroundColor: role === 'pro' ? 'var(--primary-light)' : 'var(--surface)',
            color: role === 'pro' ? 'var(--primary-hover)' : 'var(--text-main)',
            transition: 'all 0.2s'
          }}
        >
          <Briefcase size={28} />
          <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Soy Profesional</span>
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Quiero enseñar</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Nombre Completo</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0 1rem', background: 'var(--surface)' }}>
            <User size={18} color="var(--text-muted)" />
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Tu nombre y apellidos" style={{ width: '100%', padding: '0.9rem', border: 'none', outline: 'none', background: 'transparent' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Correo Electrónico</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0 1rem', background: 'var(--surface)' }}>
            <Mail size={18} color="var(--text-muted)" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com" style={{ width: '100%', padding: '0.9rem', border: 'none', outline: 'none', background: 'transparent' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Contraseña segura</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0 1rem', background: 'var(--surface)' }}>
            <Lock size={18} color="var(--text-muted)" />
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} required placeholder="••••••••" minLength={6} style={{ width: '100%', padding: '0.9rem', border: 'none', outline: 'none', background: 'transparent' }} />
          </div>
        </div>
        
        <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '1rem', marginTop: '0.5rem', fontSize: '1rem', opacity: isSubmitting ? 0.7 : 1 }}>
          {isSubmitting ? 'Registrando...' : `Crear cuenta de ${role === 'client' ? 'Cliente' : 'Profesional'}`}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Inicia sesión aquí</Link>
      </p>
    </div>
  );
}
