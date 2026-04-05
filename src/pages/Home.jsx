import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q)}&loc=${encodeURIComponent(loc)}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <section style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-lg)' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-hover)' }}>
          Encuentra al profesional ideal cerca de ti
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto' }}>
          Reserva clases de 45 minutos de deporte, educación, cocina y más.
        </p>
        
        <form onSubmit={handleSearch} className="card" style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', maxWidth: '600px', margin: '0 auto', flexDirection: 'column', '@media(minWidth: 640px)': { flexDirection: 'row' } }}>
          <datalist id="activities">
            <option value="Pádel" />
            <option value="Yoga" />
            <option value="Pilates" />
            <option value="Apoyo Escolar" />
            <option value="Cocina" />
          </datalist>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 0.5rem', borderRight: '1px solid var(--border-color)' }}>
             <Search size={20} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
             <input type="text" list="activities" value={q} onChange={e => setQ(e.target.value)} placeholder="¿Qué quieres aprender?" style={{ border: 'none', outline: 'none', width: '100%', padding: '0.75rem 0' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 0.5rem' }}>
             <MapPin size={20} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
             <input type="text" value={loc} onChange={e => setLoc(e.target.value)} placeholder="Tu ubicación o CP" style={{ border: 'none', outline: 'none', width: '100%', padding: '0.75rem 0' }} />
          </div>
          <button type="submit" className="btn-primary" style={{ minWidth: '120px' }}>Buscar</button>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Categorías Destacadas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
          {['Apoyo escolar', 'Cocina', 'Yoga', 'Pilates', 'Pádel', 'Entrenamiento'].map(cat => (
            <div key={cat} className="card" style={{ padding: '2rem 1rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{cat[0]}</span>
              </div>
              <p style={{ fontWeight: 500 }}>{cat}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
