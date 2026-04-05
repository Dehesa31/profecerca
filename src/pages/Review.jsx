import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../contexts/BookingContext';
import { Star, MessageSquareQuote, CheckCircle2, ArrowLeft, Shield } from 'lucide-react';

export default function Review() {
  const { id } = useParams();
  const { user } = useAuth();
  const { bookings, addReview } = useBookings();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!user) return <div style={{ textAlign: 'center', padding: '4rem' }}>Inicia sesión.</div>;

  const booking = bookings.find(b => b.id === id);

  if (!booking) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Reserva no encontrada.</div>;
  }

  const isClient = user.role === 'client';
  const targetName = isClient ? 'el Profesional' : 'tu Cliente';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return alert('Por favor, selecciona una puntuación de estrellas obligatoriamente.');
    
    addReview(booking.id, user.role, rating, comment);
    setSubmitted(true);
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center', padding: '3rem', borderRadius: 'var(--radius-lg)' }} className="glass-panel">
        <CheckCircle2 size={64} color="#10B981" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>¡Evaluación Registrada!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Gracias por blindar la comunidad. Tus reseñas {isClient ? 'públicas garantizan la máxima transparencia.' : 'internas nos ayudan a segmentar usuarios conflictivos.'}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/dashboard" className="btn-outline" style={{ padding: '0.5rem', border: 'none' }}><ArrowLeft size={24} /></Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Evaluar Sesión ({booking.date})</h1>
      </div>

      <div className="card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <img 
              src={`https://i.pravatar.cc/150?u=${isClient ? booking.proId : booking.clientId}`} 
              alt={targetName} 
              style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem', border: '3px solid var(--primary-light)' }} 
           />
           <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>¿Cómo fue la experiencia con {targetName}?</h3>
           <span style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, margin: '0.5rem 0' }}>
             Clase {booking.type === 'individual' ? 'Privada' : 'Grupal'} - {booking.modality}
           </span>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
             {isClient ? <><Shield size={16} /> Tu reseña quedará fijada públicamente en su perfil.</> : <><Shield size={16} /> Evaluación restringida al equipo interno. Afecta al Ranking. </>}
           </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', margin: '1rem 0' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.1s' }}
            >
              <Star 
                size={52} 
                fill={(hoverRating || rating) >= star ? '#F59E0B' : 'transparent'} 
                color={(hoverRating || rating) >= star ? '#F59E0B' : '#D1D5DB'} 
                style={{ transform: (hoverRating || rating) === star ? 'scale(1.15)' : 'scale(1)' }}
              />
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
           <div>
             <label style={{ display: 'flex', marginBottom: '0.75rem', fontWeight: 700, alignItems: 'center', gap: '0.5rem' }}>
               <MessageSquareQuote size={20} color="var(--primary)" /> Escribe un comentario descriptivo (Opcional)
             </label>
             <textarea 
               rows={4} 
               value={comment} 
               onChange={e => setComment(e.target.value)} 
               placeholder={isClient ? "El profe llegó a tiempo, super amable. Corrigió mi golpe y sudamos bastante..." : "El aula/zona del cliente estaba en perfectas condiciones y hubo predisposición..."}
               style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: '1rem', backgroundColor: '#F9FAFB' }}
             />
           </div>

           <button type="submit" className="btn-primary" style={{ padding: '1.25rem', fontSize: '1.1rem', marginTop: '1rem', justifyContent: 'center' }}>
             Sellar Evaluación de Confianza
           </button>
        </form>
      </div>

    </div>
  );
}
