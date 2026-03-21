import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Calendar, MessageCircle, Award } from 'lucide-react';

export default function Profile() {
  const { id } = useParams();
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card" style={{ padding: '2rem', display: 'flex', gap: '2rem', flexDirection: 'column', '@media(minWidth: 640px)': { flexDirection: 'row' } }}>
        <img src={`https://i.pravatar.cc/150?u=${id || 1}`} alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', alignSelf: 'center' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Carlos Martín</h1>
              <p style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '1.1rem' }}>Profesor de Pádel</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>25€</span>
              <span style={{ color: 'var(--text-muted)' }}>/45min</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Star size={16} fill="#FBBF24" color="#FBBF24" /> 4.9 (120 reseñas)</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={16} /> Madrid Centro (Se desplaza 10km)</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: 500 }}><Award size={16} /> Nivel 5 PRO</span>
          </div>
          
          <p style={{ color: 'var(--text-main)', lineHeight: 1.6, marginTop: '0.5rem' }}>
            Entrenador nacional de pádel con 5 años de experiencia dando clases a todos los niveles. Me adapto a tu ritmo y objetivos.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Link to={`/book/${id}`} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              <Calendar size={18} /> Mostrar Disponibilidad
            </Link>
          </div>
        </div>
      </div>
      
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Reseñas Destacadas</h3>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>Ana García</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hace 2 días</span>
           </div>
           <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}><Star size={14} fill="#FBBF24" color="#FBBF24" /> 5.0</span>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Excelente clase, muy dinámico y paciente. Repetiré sin duda.</p>
        </div>
      </div>
    </div>
  );
}
