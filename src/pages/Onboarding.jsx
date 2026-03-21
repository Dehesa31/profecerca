import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Upload, Phone } from 'lucide-react';

export default function Onboarding() {
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  // Differentiated state for professional vs client profile extension
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('Pádel');
  const [preferences, setPreferences] = useState('');

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.role === 'pro' && !phone) return alert("Los profesionales deben indicar un teléfono para validar su cuenta.");
    
    const profileData = user.role === 'pro' 
      ? { phone, bio, category } 
      : { preferences };
      
    await completeOnboarding(profileData);
    navigate(user.role === 'pro' ? '/dashboard' : '/');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
         <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>1</span>
         </div>
         <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Completa tu Perfil</h1>
            <p style={{ color: 'var(--text-muted)' }}>Último paso antes de empezar</p>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Onboarding Específico para PROFESIONALES */}
        {user.role === 'pro' && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Foto Profesional</label>
              <div style={{ padding: '2rem', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', textAlign: 'center', backgroundColor: 'var(--bg-color)', cursor: 'pointer' }}>
                <Upload size={32} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sube una foto tuya clara y profesional. <br/>(Simulado para MVP)</p>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Teléfono (Validación Requerida)</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0 1rem' }}>
                 <Phone size={18} color="var(--text-muted)" />
                 <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="+34 600 000 000" style={{ width: '100%', padding: '0.9rem', border: 'none', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Especialidad / Categoría</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'transparent' }}>
                <option value="Pádel">Pádel</option>
                <option value="Yoga">Yoga</option>
                <option value="Cocina">Cocina</option>
                <option value="Apoyo Escolar">Apoyo Escolar</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Biografía y Experiencia</label>
              <textarea rows={4} value={bio} onChange={e => setBio(e.target.value)} placeholder="Describe tus años de experiencia, metodología..." style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}></textarea>
            </div>
          </>
        )}

        {/* Onboarding Específico para CLIENTES */}
        {user.role === 'client' && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>¿Qué te gustaría aprender?</label>
              <textarea rows={3} value={preferences} onChange={e => setPreferences(e.target.value)} placeholder="Ej: Busco clases de yoga para nivel principiante..." style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}></textarea>
            </div>
            <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
               <CheckCircle size={24} color="var(--primary)" />
               <p style={{ fontSize: '0.9rem', color: 'var(--primary-hover)' }}>Tu perfil de cliente es casi automático. No requerimos validación telefónica.</p>
            </div>
          </>
        )}

        <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1.05rem', marginTop: '1rem' }}>
          Guardar y Entrar a ProfeCerca
        </button>
      </form>
    </div>
  );
}
