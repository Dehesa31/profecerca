import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../contexts/BookingContext';
import { Clock, Calendar, XCircle, MessageCircle, AlertTriangle, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { bookings, updateBookingStatus } = useBookings();

  if (!user) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Por favor, inicia sesión.</div>;
  }

  const myBookings = bookings.filter(b => user.role === 'pro' ? b.proId === '1' || b.proId === user.id : (b.clientId === user.id || b.clientId === 'usr_dummy'));

  const pendingBookings = myBookings.filter(b => b.status === 'pendiente');
  const confirmedBookings = myBookings.filter(b => b.status === 'confirmada');
  const upcomingBookings = [...pendingBookings, ...confirmedBookings];
  const pastBookings = myBookings.filter(b => b.status !== 'pendiente' && b.status !== 'confirmada');

  const proRevenue = myBookings.filter(b => b.status === 'completada' || b.status === 'cancelada_cliente').reduce((acc, curr) => acc + (curr.price || (curr.type === 'individual' ? 25 : 15)), 0);

  const handleStatusUpdate = (bId, status) => {
    updateBookingStatus(bId, status, { by: user.role, reason: 'Manual Pro action' });
  };

  const handleCancel = (booking) => {
    // Calculadora dinámica de márgenes de 24h
    const bookingDate = new Date(`${booking.date}T${booking.time}:00`);
    const now = new Date();
    // Añadimos horas arbitrarias al 'now' para forzar/testear lógica si fuera necesario, 
    // pero para el MVP tomaremos la fecha real estricta.
    const hoursDifference = (bookingDate - now) / (1000 * 60 * 60);

    let confirmMsg = '';
    let status = user.role === 'client' ? 'cancelada_cliente' : 'cancelada_pro';

    if (hoursDifference <= 24 && hoursDifference > 0) {
      if (user.role === 'client') {
        confirmMsg = '⚠️ PENALIZACIÓN ACTIVA: Faltan menos de 24 horas para la hora pactada. El sistema te cobrará el 100% de la clase para compensar al profesional por el hueco perdido. ¿Estás absolutamente seguro de que quieres cancelar?';
      } else {
        confirmMsg = '⚠️ IMPACTO REPUTACIONAL: Como profesional, cancelar avisando a menos de 24h restará puntos automáticos de tu nivel y te bajará en el ranking. ¿Cancelar de todos modos?';
      }
    } else if (hoursDifference <= 0) {
       alert("No puedes cancelar una sesión que ya ha transcurrido. Si hubo alguna incidencia, contacta a Soporte.");
       return;
    } else {
       confirmMsg = `Estás a tiempo (Faltan ${Math.floor(hoursDifference)} horas). La cancelación es 100% libre de penalizaciones. ¿Confirmar cancelación y liberar el hueco en agenda?`;
    }

    if (window.confirm(confirmMsg)) {
      updateBookingStatus(booking.id, status, { by: user.role, reason: 'Manual user string' });
    }
  };

  const statusMap = {
    'pendiente': { color: '#B45309', bg: '#FEF3C7', label: 'Pendiente' },
    'confirmada': { color: '#047857', bg: '#D1FAE5', label: 'Confirmada' },
    'completada': { color: '#1D4ED8', bg: '#DBEAFE', label: 'Completada' },
    'cancelada_cliente': { color: '#B91C1C', bg: '#FEE2E2', label: 'Cancelada por Cliente' },
    'cancelada_pro': { color: '#B91C1C', bg: '#FEE2E2', label: 'Cancelada por Pro' },
    'no_show_cliente': { color: '#7F1D1D', bg: '#FECACA', label: 'No-Show (Cliente)' },
    'no_show_pro': { color: '#7F1D1D', bg: '#FECACA', label: 'Falta del Pro' }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Panel de Control</h1>
        {user.role === 'pro' && (
          <Link to="/agenda" className="btn-primary">
            Planificar Agenda 🗓️
          </Link>
        )}
      </header>

      {user.role === 'pro' && (
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div className="card" style={{ flex: 1, padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', minWidth: '220px' }}>
            <div style={{ padding: '1rem', backgroundColor: '#D1FAE5', borderRadius: '50%' }}><TrendingUp color="#10B981" size={24} /></div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Total Ingresos</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{proRevenue}€</p>
            </div>
          </div>
          <div className="card" style={{ flex: 1, padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', minWidth: '220px' }}>
            <div style={{ padding: '1rem', backgroundColor: '#DBEAFE', borderRadius: '50%' }}><Users color="#2563EB" size={24} /></div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Próximas Clases</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{upcomingBookings.length}</p>
            </div>
          </div>
        </div>
      )}
      
      {myBookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>No tienes movimientos ni reservas en tu historial.</p>
          <Link to="/search" className="btn-primary" style={{ padding: '1rem 2rem' }}>Explorar Clases y Profes</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {upcomingBookings.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Próximas Sesiones</h2>
              <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'minmax(0, 1fr)' }}>
                {upcomingBookings.map(b => renderBooking(b))}
              </div>
            </div>
          )}

          {pastBookings.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Historial e Incidencias</h2>
              <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'minmax(0, 1fr)' }}>
                {pastBookings.map(b => renderBooking(b))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  function renderBooking(b) {
            const isCancelable = b.status === 'confirmada' || b.status === 'pendiente';
            const isCompleted = b.status === 'completada';
            const isCancelled = b.status.startsWith('cancelada') || b.status.startsWith('no_show');
            const styling = statusMap[b.status] || { color: 'gray', bg: '#eee', label: b.status };
            const hasReviewed = b.reviews && b.reviews.some(r => r.role === user.role);

            // Determinar si mostrar aviso de -24h en interfaz antes de hacer clic
            let lessThan24h = false;
            if (isCancelable) {
              const diff = (new Date(`${b.date}T${b.time}:00`) - new Date()) / 3600000;
              if (diff > 0 && diff <= 24) lessThan24h = true;
            }

            return (
              <div key={b.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: `5px solid ${styling.color}`, transition: 'all 0.2s', '@media(minWidth: 640px)': { flexDirection: 'row', alignItems: 'center' } }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{b.type === 'individual' ? 'Privada' : 'Grupal'} - {b.modality}</h3>
                    <span style={{ 
                      background: styling.bg, 
                      color: styling.color, 
                      padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' 
                    }}>
                      {styling.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 500 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={18} color="var(--primary)"/> {b.date.split('-').reverse().join('/')}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={18} color="var(--primary)"/> {b.time} (45m)</span>
                    {b.paymentStatus === 'retenido' && <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10B981', fontWeight: 700 }}>🛡️ Fondos Asegurados</span>}
                  </div>
                  {isCancelled && b.cancellationLog && (
                    <p style={{ fontSize: '0.8rem', color: '#B91C1C', margin: 0 }}>
                      Anulada el {new Date(b.cancellationLog.timestamp).toLocaleDateString('es-ES', {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column', minWidth: '160px' }}>
                  {!isCancelled && (
                    <Link to={user.role === 'client' ? `/chat?proId=${b.proId}` : `/chat?clientId=${b.clientId}`} className="btn-outline" style={{ padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', fontWeight: 600 }}>
                      <MessageCircle size={18} /> Chat 
                    </Link>
                  )}
                  
                  {isCompleted ? (
                    hasReviewed ? (
                      <span style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', justifyContent: 'center', fontWeight: 600, background: '#D1FAE5', border: '1px solid #A7F3D0', borderRadius: 'var(--radius-md)' }}>
                        ✅ Evaluado
                      </span>
                    ) : (
                      <Link to={`/review/${b.id}`} className="btn-primary" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F59E0B', color: '#78350F', justifyContent: 'center', fontWeight: 600 }}>
                        Evaluar ⭐
                      </Link>
                    )
                  ) : b.status === 'pendiente' && user.role === 'pro' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button className="btn-primary" style={{ padding: '0.8rem', backgroundColor: '#10B981', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={() => handleStatusUpdate(b.id, 'confirmada')}>
                        <CheckCircle size={18} /> Aceptar
                      </button>
                      <button className="btn-outline" style={{ padding: '0.8rem', borderColor: '#FCA5A5', color: '#EF4444', display: 'flex', justifyContent: 'center', gap: '0.5rem' }} onClick={() => handleStatusUpdate(b.id, 'cancelada_pro')}>
                        <XCircle size={18} /> Rechazar
                      </button>
                    </div>
                  ) : isCancelable ? (
                    <button 
                      className="btn-outline" 
                      style={{ 
                        color: lessThan24h ? 'white' : '#EF4444', 
                        borderColor: lessThan24h ? '#EF4444' : '#FCA5A5', 
                        padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', 
                        background: lessThan24h ? '#EF4444' : '#FEF2F2', fontWeight: 600 
                      }} 
                      onClick={() => handleCancel(b)}
                    >
                      {lessThan24h ? <AlertTriangle size={18} /> : <XCircle size={18} />}
                      {lessThan24h ? 'Cancelar (Penalización)' : 'Cancelar Gratis'}
                    </button>
                  ) : null}
                </div>
              </div>
            )
  }
}
