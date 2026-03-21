import { useAuth } from '../contexts/AuthContext';
import { Clock, Calendar, XCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Por favor, inicia sesión.</div>;
  }

  const mockBookings = [
    { id: 1, pro: 'Carlos Martín', category: 'Pádel', date: 'Mñn., 10:30', status: 'confirmada', cancelable: true, completed: false },
    { id: 2, pro: 'Laura Gómez', category: 'Yoga', date: 'Hoy, 18:00', status: 'confirmada', cancelable: false, completed: false },
    { id: 3, pro: 'Miguel Ángel', category: 'Cocina', date: 'Ayer, 12:00', status: 'completada', cancelable: false, completed: true }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Mis Reservas</h1>
      
      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'minmax(0, 1fr)' }}>
        {mockBookings.map(b => (
          <div key={b.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', '@media(minWidth: 640px)': { flexDirection: 'row', alignItems: 'center' } }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{b.category} con {b.pro}</h3>
                <span style={{ background: b.completed ? '#E5E7EB' : 'var(--primary-light)', color: b.completed ? 'var(--text-muted)' : 'var(--primary)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 500, textTransform: 'capitalize' }}>
                  {b.status}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={16} /> {b.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={16} /> 45 min</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', '@media(minWidth: 640px)': { flexDirection: 'row', alignItems: 'center' } }}>
              <Link to="/chat" className="btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageCircle size={16} /> Chat
              </Link>
              
              {b.completed ? (
                 <Link to={`/review/${b.id}`} className="btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FBBF24', color: '#78350F' }}>
                   Dejar Reseña ⭐
                 </Link>
              ) : b.cancelable ? (
                <button className="btn-outline" style={{ color: '#EF4444', borderColor: '#FCA5A5', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => alert('Reserva cancelada sin penalización (>24h).')}>
                  <XCircle size={16} /> Cancelar
                </button>
              ) : (
                <button className="btn-outline" disabled style={{ opacity: 0.5, cursor: 'not-allowed', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} title="No se puede cancelar (faltan menos de 24h)">
                  <XCircle size={16} /> Cancelar (Bloqueado)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
