import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../contexts/BookingContext';
import { Calendar as CalendarIcon, MapPin, Clock, Users, ArrowLeft } from 'lucide-react';

export default function Book() {
  const { id } = useParams();
  const { user } = useAuth();
  const { getAvailableSlots, requestBooking } = useBookings();
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(null);
  const [modality, setModality] = useState('Pista Exterior');
  const [type, setType] = useState('individual');

  // Generar exactamente los próximos 7 días según reglas de negocio
  const days = useMemo(() => {
    return Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        dateStr: d.toISOString().split('T')[0],
        name: d.toLocaleDateString('es-ES', { weekday: 'short' }),
        num: d.getDate()
      };
    });
  }, []);

  useEffect(() => {
    if (days.length > 0 && !date) setDate(days[0].dateStr);
  }, [days, date]);

  const availableSlots = useMemo(() => {
    if (!date) return [];
    return getAvailableSlots(id, date);
  }, [date, id, getAvailableSlots, type]);

  const handleBook = () => {
    navigate('/checkout', {
      state: {
        bookingData: {
          proId: id,
          clientId: user.id,
          date,
          time: timeSlot.time,
          type,
          modality
        }
      }
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to={`/profile/${id}`} className="btn-outline" style={{ padding: '0.5rem', border: 'none' }}><ArrowLeft size={24} /></Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Motor de Reservas</h1>
      </div>
      
      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* TIPO DE CLASE */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Users size={20} color="var(--primary)"/> Tipo de Clase y Precio</h3>
          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', '@media(minWidth: 640px)': { flexDirection: 'row' } }}>
            <button onClick={() => { setType('individual'); setTimeSlot(null); }} style={{ flex: 1, padding: '1.25rem', borderRadius: 'var(--radius-md)', border: type === 'individual' ? '2px solid var(--primary)' : '1px solid var(--border-color)', backgroundColor: type === 'individual' ? 'var(--primary-light)' : 'transparent', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', transition: 'all 0.2s' }}>
              <span style={{ fontSize: '1.1rem' }}>Individual</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: type === 'individual' ? 'var(--primary)' : 'var(--text-main)' }}>25€</span>
            </button>
            <button onClick={() => { setType('grupal'); setTimeSlot(null); }} style={{ flex: 1, padding: '1.25rem', borderRadius: 'var(--radius-md)', border: type === 'grupal' ? '2px solid var(--primary)' : '1px solid var(--border-color)', backgroundColor: type === 'grupal' ? 'var(--primary-light)' : 'transparent', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', transition: 'all 0.2s' }}>
              <span style={{ fontSize: '1.1rem' }}>Grupal Múltiple</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: type === 'grupal' ? 'var(--primary)' : 'var(--text-main)' }}>15€ <span style={{ fontSize: '0.85rem', fontWeight: 400 }}>/pers.</span></span>
            </button>
          </div>
        </div>

        {/* DIAS */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><CalendarIcon size={20} color="var(--primary)" /> Día (Agenda Máx 7 días)</h3>
          <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.75rem' }}>
            {days.map(d => (
              <button 
                key={d.dateStr}
                onClick={() => { setDate(d.dateStr); setTimeSlot(null); }}
                style={{ 
                  flex: '0 0 auto', width: '75px', height: '90px', borderRadius: 'var(--radius-lg)', 
                  border: date === d.dateStr ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: date === d.dateStr ? 'var(--primary)' : 'var(--surface)',
                  color: date === d.dateStr ? 'white' : 'var(--text-main)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  boxShadow: date === d.dateStr ? 'var(--shadow-md)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '0.85rem', opacity: 0.9, textTransform: 'uppercase', fontWeight: 600 }}>{d.name.replace('.', '')}</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.1rem' }}>{d.num}</span>
              </button>
            ))}
          </div>
        </div>

        {/* BLOQUES DE 45 MIN */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Clock size={20} color="var(--primary)"/> Franjas de 45 minutos (Sincronizado)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))', gap: '0.75rem' }}>
            {availableSlots.map(s => {
              const availableInThisMode = type === 'individual' ? s.isAvailableForIndividual : s.isAvailableForGrupal;
              
              return (
                <button 
                  key={s.time}
                  disabled={!availableInThisMode}
                  onClick={() => setTimeSlot(s)}
                  style={{ 
                    padding: '1rem 0.5rem', borderRadius: 'var(--radius-md)',
                    border: timeSlot?.time === s.time ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: !availableInThisMode ? '#F3F4F6' : (timeSlot?.time === s.time ? 'var(--primary-light)' : 'var(--surface)'),
                    fontWeight: 700, fontSize: '1.1rem',
                    color: !availableInThisMode ? '#9CA3AF' : (timeSlot?.time === s.time ? 'var(--primary-hover)' : 'inherit'),
                    opacity: !availableInThisMode ? 0.6 : 1,
                    cursor: !availableInThisMode ? 'not-allowed' : 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.15s'
                  }}
                >
                  {s.time}
                  {availableInThisMode && type === 'grupal' && s.groupSpotsTaken > 0 && <span style={{fontSize:'0.65rem', color:'var(--primary)', marginTop:'0.2rem'}}>{s.maxSpots - s.groupSpotsTaken} plazas libres</span>}
                </button>
              )
            })}
          </div>
          {availableSlots.length === 0 && <p style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>No hay horarios disponibles este día.</p>}
        </div>

        {/* UBICACION */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><MapPin size={20} color="var(--primary)"/> Tu lugar de preferencia</h3>
          <select 
            value={modality} 
            onChange={(e) => setModality(e.target.value)}
            style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--surface)', fontSize: '1rem' }}
          >
            <option value="Domicilio Cliente">En mi domicilio (Se desplaza gratis si {"<"} 15km)</option>
            <option value="Casa Profesional">En casa del profesional</option>
            <option value="Pista Exterior">En el exterior / pista asignada (+5€ por pista)</option>
          </select>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleBook}
          disabled={!timeSlot}
          style={{ padding: '1.25rem', fontSize: '1.2rem', marginTop: '1rem', opacity: !timeSlot ? 0.5 : 1, transition: 'all 0.3s' }}
        >
          {timeSlot ? `Confirmar por ${type === 'individual' ? '25€' : '15€'} a las ${timeSlot.time}` : 'Selecciona una hora para habilitar pago'}
        </button>
      </div>
    </div>
  );
}
