import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

const MOCK_PROS = [
  { id: '1', name: 'Carlos Martín', category: 'Pádel', level: 5, rating: 4.9, distance: '1.2 km', price: 25, img: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Laura Gómez', category: 'Yoga', level: 4, rating: 4.7, distance: '3.5 km', price: 20, img: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Miguel Ángel', category: 'Cocina', level: 8, rating: 5.0, distance: '5.0 km', price: 35, img: 'https://i.pravatar.cc/150?u=3' }
];

export default function Search() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Resultados de búsqueda</h1>
      
      <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column', '@media(minWidth: 768px)': { flexDirection: 'row' } }}>
        <aside style={{ width: '100%', maxWidth: '250px' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Filtros</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Categoría</label>
              <select style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <option>Todas</option>
                <option>Pádel</option>
                <option>Yoga</option>
                <option>Cocina</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Distancia Máxima</label>
              <input type="range" min="1" max="50" defaultValue="10" style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>1km</span><span>50km</span>
              </div>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {MOCK_PROS.map(pro => (
            <Link to={`/profile/${pro.id}`} key={pro.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                <img src={pro.img} alt={pro.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{pro.name}</h3>
                  <p style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 500 }}>{pro.category}</p>
                </div>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}><Star size={16} fill="#FBBF24" color="#FBBF24" /> {pro.rating}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}><MapPin size={16} /> {pro.distance}</span>
                </div>
                <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', alignSelf: 'flex-start', fontWeight: 500 }}>
                  Nivel {pro.level}
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>{pro.price}€<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>/45m</span></span>
                  <button className="btn-outline" style={{ padding: '0.5rem 1rem' }}>Ver perfil</button>
                </div>
              </div>
            </Link>
          ))}
        </main>
      </div>
    </div>
  );
}
