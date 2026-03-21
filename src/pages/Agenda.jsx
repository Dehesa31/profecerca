import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../contexts/BookingContext';
import { Calendar, CheckCircle2, XCircle, Clock, ShieldCheck, PowerIcon } from 'lucide-react';

export default function Agenda() {
  const { user } = useAuth();
  const { proSettings, getAvailableSlots, toggleBlockSlot, bookings, updateBookingStatus } = useBookings();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const myBookings = bookings.filter(b => b.proId === '1' /* MVP pro hack */ && b.status !== 'no_show');
  const pendingBookings = myBookings.filter(b => b.status === 'pendiente');

  // Días vista para el pro (puede ver 14 días para planificar)
  const days = useMemo(() => Array.from({length: 12}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return { dateStr: d.toISOString().split('T')[0], name: d.toLocaleDateString('es-ES', { weekday: 'short' }), num: d.getDate() };
  }), []);

  const slots = getAvailableSlots('1', date);
  const settings = proSettings['1'];
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '4rem' }}>
      
      <header style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
         <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Mi Agenda Profesional</h1>
         <p style={{ color: 'var(--text-muted)' }}>Gestiona tu disponibilidad general y en tiempo real.</p>
      </header>

      {/* REQUESTS PENDING TO ACCEPT */}
      {pendingBookings.length > 0 && (
        <section className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '2px solid #FEF3C7' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#B45309', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={24} /> Solicitudes Pendientes ({pendingBookings.length})
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {pendingBookings.map(b => (
              <div key={b.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', '@media(minWidth: 640px)': { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } }}>
                <div>
                   <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Reserva {b.type} - {b.modality}</h4>
                   <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>Cliente Anónimo • <strong>{b.date}</strong> a las <strong>{b.time}</strong></p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <button onClick={() => updateBookingStatus(b.id, 'confirmada')} className="btn-primary" style={{ backgroundColor: '#10B981', padding: '0.75rem 1.5rem', fontSize: '1rem' }}>✅ Aceptar</button>
                   <button onClick={() => updateBookingStatus(b.id, 'cancelada')} className="btn-outline" style={{ borderColor: '#EF4444', color: '#EF4444', padding: '0.75rem 1.5rem', fontSize: '1rem', background: '#FEF2F2' }}>❌ Rechazar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GLOBAL SETTINGS FOR PRO */}
      <section className="card" style={{ padding: '2rem', display: 'flex', gap: '2rem', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--primary-light)', border: 'none' }}>
         <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-hover)', marginBottom: '0.25rem' }}>Aprobación Automática</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--primary)', maxWidth: '400px' }}>Si está activa, no tendrás que revisar manualmente las peticiones pendientes.</p>
         </div>
         <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-full)' }}>
            <PowerIcon size={18} /> {settings.autoAccept ? 'Desactivar' : 'Activar (Recomendado)'}
         </button>
      </section>

      {/* AGENDA CALENDAR CONTROLLER */}
      <section className="card" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={22} color="var(--primary)" /> Gestor de Franjas de 45 mins</h2>
        
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
          {days.map(d => (
            <button 
              key={d.dateStr}
              onClick={() => setDate(d.dateStr)}
              style={{ 
                flex: '0 0 auto', width: '70px', height: '85px', borderRadius: 'var(--radius-md)', 
                border: date === d.dateStr ? '2px solid var(--primary)' : '1px solid transparent',
                backgroundColor: date === d.dateStr ? 'var(--primary-light)' : 'transparent',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s'
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: date === d.dateStr ? 'var(--primary)' : 'var(--text-muted)' }}>{d.name.toUpperCase()}</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: date === d.dateStr ? 'var(--primary)' : 'var(--text-main)' }}>{d.num}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
          {slots.map(s => {
            const hasBooking = myBookings.find(b => b.date === date && b.time === s.time && b.status !== 'cancelada');
            const isBlockedManual = !s.isAvailable && !hasBooking && s.groupSpotsTaken === 0;
            
            return (
              <button 
                key={s.time}
                onClick={() => !hasBooking && toggleBlockSlot('1', date, s.time)}
                disabled={!!hasBooking}
                title={hasBooking ? 'Ya hay alguien en esta clase' : 'Click para bloquear/desbloquear'}
                style={{ 
                  padding: '1.25rem 1rem', borderRadius: 'var(--radius-md)',
                  border: hasBooking ? '2px solid #10B981' : (isBlockedManual ? '2px dashed #EF4444' : '1px solid var(--border-color)'),
                  background: hasBooking ? '#D1FAE5' : (isBlockedManual ? '#FEE2E2' : 'var(--surface)'),
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                  opacity: hasBooking ? 1 : (isBlockedManual ? 0.7 : 1),
                  cursor: hasBooking ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: hasBooking ? '#065F46' : (isBlockedManual ? '#991B1B' : 'var(--text-main)') }}>{s.time}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: hasBooking ? '#059669' : (isBlockedManual ? '#DC2626' : 'var(--primary)'), textTransform: 'uppercase' }}>
                  {hasBooking ? '✅ Reservado' : (isBlockedManual ? '❌ Bloqueado' : 'Abierto')}
                </span>
                {!hasBooking && s.groupSpotsTaken > 0 && <span style={{fontSize:'0.75rem', marginTop: '0.2rem', color: '#059669'}}>{s.groupSpotsTaken}/{s.maxSpots} pax.</span>}
              </button>
            )
          })}
        </div>
        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>💡 <strong>Tips del sistema:</strong> Clica en cualquier franja "Abierta" para que desaparezca del escaparate público. Las celdas verdes significan que un usuario ya ha pagado o confirmado su asistencia y no puedes moverlas. Abre tu agenda con tiempo para posicionar tu nivel más alto.</p>
      </section>
      
    </div>
  );
}
