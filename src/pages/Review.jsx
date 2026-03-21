import { useState } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Review() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return alert('Por favor, selecciona una puntuación.');
    alert('¡Reseña guardada exitosamente! Gracias por ayudar a mantener el nivel del profesional.');
    navigate('/dashboard');
  };

  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '3rem 2rem' }} className="card">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>¿Cómo fue la clase 🎾?</h2>
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2.5rem' }}>Tu opinión ayuda a mantener la calidad de la comunidad bidireccional.</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(rating)}
            style={{ padding: '0.5rem', transition: 'transform 0.1s' }}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.9)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            <Star 
              size={44} 
              fill={(hover || rating) >= star ? '#FBBF24' : 'transparent'} 
              color={(hover || rating) >= star ? '#FBBF24' : 'var(--border-color)'} 
            />
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <textarea 
          placeholder="Escribe tu reseña (opcional)..." 
          rows="4"
          style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', resize: 'vertical', fontFamily: 'inherit', outline: 'none' }}
        ></textarea>
        
        <button type="submit" className="btn-primary" style={{ padding: '1.25rem', fontSize: '1.1rem' }}>
          Enviar Reseña Pública
        </button>
      </form>
    </div>
  );
}
