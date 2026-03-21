import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';

export default function Book() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [date, setDate] = useState(0); 
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('domicilio');

  const days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      index: i,
      name: d.toLocaleDateString('es-ES', { weekday: 'short' }),
      num: d.getDate()
    };
  });

  const slots = ['09:00', '09:45', '10:30', '16:00', '16:45', '17:30', '18:15'];

  const handleBook = () => {
    if (!user) {
      alert("Debes iniciar sesión para reservar");
      navigate('/login');
      return;
    }
    alert(`Reserva confirmada. ¡Nos vemos allí!`);
    navigate('/dashboard');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Confirmar Reserva</h1>
      
      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CalendarIcon size={18} /> Selecciona el Día (Máx 7 días vista)</h3>
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {days.map(d => (
              <button 
                key={d.index}
                onClick={() => setDate(d.index)}
                style={{ 
                  flex: '0 0 auto', width: '64px', height: '80px', borderRadius: 'var(--radius-md)', 
                  border: date === d.index ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: date === d.index ? 'var(--primary-light)' : 'var(--surface)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <span style={{ fontSize: '0.8rem', color: date === d.index ? 'var(--primary)' : 'var(--text-muted)' }}>{d.name.toUpperCase()}</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: date === d.index ? 'var(--primary)' : 'var(--text-main)' }}>{d.num}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={18} /> Bloques de 45 minutos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem' }}>
            {slots.map(s => (
              <button 
                key={s}
                onClick={() => setTime(s)}
                style={{ 
                  padding: '0.75rem', borderRadius: 'var(--radius-md)',
                  border: time === s ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: time === s ? 'var(--primary-light)' : 'var(--surface)',
                  fontWeight: 500,
                  color: time === s ? 'var(--primary-hover)' : 'inherit'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} /> Modalidad y Lugar</h3>
          <select 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--surface)' }}
          >
            <option value="domicilio">En mi domicilio (El profesional se desplaza)</option>
            <option value="casa_pro">En casa del profesional</option>
            <option value="exterior">En el exterior / pista / parque</option>
          </select>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleBook}
          disabled={!time}
          style={{ padding: '1.25rem', fontSize: '1.1rem', marginTop: '1rem', opacity: !time ? 0.5 : 1 }}
        >
          {time ? `Confirmar Reserva a las ${time}` : 'Selecciona una hora'}
        </button>
      </div>
    </div>
  );
}
