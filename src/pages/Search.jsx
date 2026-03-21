import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, MapPin, Filter, X, Navigation, SlidersHorizontal, ArrowUpDown, ChevronDown } from 'lucide-react';

// Haversine formula para distancias reales
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1) * (Math.PI/180);
  const dLon = (lon2-lon1) * (Math.PI/180); 
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

// Catálogo Simulado Base (Datos Mocks de Profesionales con lat/lon aproximados en España)
const initialPros = [
  { id: 1, name: 'Carlos Martín', category: 'Pádel', desc: 'Entrenador nacional certificado.', rating: 4.9, reviews: 124, distance: 2.5, price: 25, type: 'individual', level: 5, language: 'Español', modality: 'Pista Exterior', coords: {lat: 40.4168, lng: -3.7038}, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Laura Gómez', category: 'Yoga', desc: 'Vinyasa y Hatha Yoga relajante.', rating: 4.8, reviews: 89, distance: 1.2, price: 15, type: 'grupal', level: 4, language: 'Inglés', modality: 'Casa Profesional', coords: {lat: 40.4500, lng: -3.6900}, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'David Rodríguez', category: 'Apoyo Escolar', desc: 'Matemáticas y ciencias ESO/Bachiller.', rating: 4.5, reviews: 45, distance: 5.0, price: 20, type: 'individual', level: 3, language: 'Español', modality: 'Domicilio Cliente', coords: {lat: 40.4000, lng: -3.7100}, avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Elena Torres', category: 'Cocina', desc: 'Chef ex-Estrella Michelin. Trucos pro.', rating: 5.0, reviews: 200, distance: 8.5, price: 35, type: 'ambos', level: 5, language: 'Francés', modality: 'Casa Profesional', coords: {lat: 40.4800, lng: -3.6800}, avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 5, name: 'Miguel Ángel', category: 'Pilates', desc: 'Máquinas y Suelo rehabilitador.', rating: 4.2, reviews: 110, distance: 0.5, price: 30, type: 'individual', level: 4, language: 'Español', modality: 'Exterior', coords: {lat: 40.4200, lng: -3.7000}, avatar: 'https://i.pravatar.cc/150?u=5' },
];

export default function Search() {
  const [searchParams] = useSearchParams();
  const rawCat = searchParams.get('category');

  // Filtros de Estado
  const [fCategory, setFCat] = useState(rawCat || 'Todas');
  const [fType, setFType] = useState('Todos');
  const [fMaxPrice, setFMaxPrice] = useState(50);
  const [fMinRating, setFMinRating] = useState(0);
  const [fMaxDistance, setFMaxDistance] = useState(15);
  const [fLang, setFLang] = useState('Todos');
  
  const [sortBy, setSortBy] = useState('relevance'); // relevance, distance, price_asc, rating_desc
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [geoStatus, setGeoStatus] = useState('idle'); // idle, loading, active, denied
  
  // Lista central de pros - mutada si el usuari se geolocaliza
  const [pros, setPros] = useState([...initialPros]);

  const toggleLocation = () => {
    if (geoStatus === 'active') {
       // Reset mock
       setPros([...initialPros]);
       setGeoStatus('idle');
       return;
    }

    setGeoStatus('loading');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          // Recalcular distancias dinámicas frente al punto real del user
          const geolocatedPros = initialPros.map(p => ({
            ...p,
            distance: parseFloat(getDistanceFromLatLonInKm(userLat, userLng, p.coords.lat, p.coords.lng).toFixed(1))
          }));
          setPros(geolocatedPros);
          setSortBy('distance'); // Auto ordenar por cercanía
          setGeoStatus('active');
        },
        (error) => {
          console.error("Geo error:", error);
          setGeoStatus('denied');
          alert("Permiso de ubicación denegado o error al obtener la posición.");
        }
      );
    } else {
      setGeoStatus('denied');
      alert("Geolocalización no soportada en este navegador.");
    }
  };

  const filteredAndSortedPros = useMemo(() => {
    let result = pros.filter(p => {
      if (fCategory !== 'Todas' && p.category !== fCategory) return false;
      if (fType !== 'Todos' && p.type !== 'ambos' && p.type !== fType.toLowerCase()) return false;
      if (p.price > fMaxPrice) return false;
      if (p.rating < fMinRating) return false;
      if (p.distance > fMaxDistance) return false;
      if (fLang !== 'Todos' && p.language !== fLang) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'distance': return a.distance - b.distance;
        case 'price_asc': return a.price - b.price;
        case 'rating_desc': return b.rating - a.rating;
        default: return b.level - a.level; // Relevance based on Pro Level
      }
    });

    return result;
  }, [pros, fCategory, fType, fMaxPrice, fMinRating, fMaxDistance, fLang, sortBy]);

  return (
    <div style={{ padding: '0 0 4rem 0' }}>
      {/* Cabecera del Buscador con Geo */}
      <div style={{ backgroundColor: 'var(--primary)', padding: '2.5rem 1rem', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', textAlign: 'center' }}>Encuentra Profesionales Cerca de Ti</h1>
        
        <div style={{ width: '100%', maxWidth: '600px', display: 'flex', gap: '0.5rem', background: 'white', padding: '0.5rem', borderRadius: 'var(--radius-full)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '1rem', gap: '0.5rem' }}>
            <MapPin color="var(--primary)" size={20} />
            <input type="text" placeholder="Barrio, CP o ciudad..." style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', background: 'transparent', color: 'black' }} />
          </div>
          <button 
            onClick={toggleLocation}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-full)', 
              background: geoStatus === 'active' ? '#10B981' : 'var(--bg-color)', 
              color: geoStatus === 'active' ? 'white' : 'var(--text-main)', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s' 
            }}
          >
            <Navigation size={18} /> 
            <span style={{ display: 'none', '@media(minWidth: 640px)': { display: 'inline' } }}>
               {geoStatus === 'loading' ? 'Buscando...' : (geoStatus === 'active' ? 'Ubicación Activa' : 'Cerca de mí')}
            </span>
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* FILTROS (SIDEBAR DESKTOP / DRAWER MOBILE) */}
        <aside style={{ 
            width: '280px', flexShrink: 0, 
            display: mobileFiltersOpen ? 'block' : 'none',
            '@media(minWidth: 800px)': { display: 'block' }
          }} 
          className="glass-panel filters-sidebar"
        >
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Filter size={20} /> Filtros
             </h2>
          </div>

          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Categorías */}
            <div>
              <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>Especialidad</label>
              <select value={fCategory} onChange={e => setFCat(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}>
                <option value="Todas">Todas las categorías</option>
                <option value="Pádel">Deporte / Pádel</option>
                <option value="Yoga">Bienestar / Yoga</option>
                <option value="Pilates">Bienestar / Pilates</option>
                <option value="Apoyo Escolar">Educación / Apoyo</option>
                <option value="Cocina">Ocio / Cocina</option>
              </select>
            </div>

            {/* Tipo de Clase */}
            <div>
              <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>Modalidad Tarifaria</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                 {['Todos', 'Individual', 'Grupal'].map(t => (
                   <button key={t} onClick={() => setFType(t)} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, border: fType === t ? '2px solid var(--primary)' : '1px solid var(--border-color)', background: fType === t ? 'var(--primary-light)' : 'transparent', color: fType === t ? 'var(--primary)' : 'var(--text-main)' }}>
                     {t}
                   </button>
                 ))}
              </div>
            </div>

            {/* Distancia Slider */}
            <div>
              <label style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                Distancia Máxima <span>{fMaxDistance} km</span>
              </label>
              <input type="range" min="1" max="50" step="1" value={fMaxDistance} onChange={e => setFMaxDistance(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
            </div>

            {/* Precio Máximo */}
            <div>
              <label style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                Precio / Sesión <span>Hasta {fMaxPrice}€</span>
              </label>
              <input type="range" min="10" max="100" step="5" value={fMaxPrice} onChange={e => setFMaxPrice(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
            </div>

            {/* Valoración Mínima */}
            <div>
              <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>Calidad (Estrellas)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                 {[0, 4, 4.5, 5].map(rating => (
                   <button key={rating} onClick={() => setFMinRating(rating)} style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600, border: fMinRating === rating ? '2px solid #F59E0B' : '1px solid var(--border-color)', background: fMinRating === rating ? '#FEF3C7' : 'transparent', color: fMinRating === rating ? '#92400E' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.2rem', flex: 1, justifyContent: 'center' }}>
                     {rating === 0 ? 'Cualquiera' : <>{rating}+⭐</>}
                   </button>
                 ))}
              </div>
            </div>

            {/* Idioma */}
            <div>
              <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>Idioma</label>
              <select value={fLang} onChange={e => setFLang(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}>
                <option value="Todos">Cualquiera</option>
                <option value="Español">Español</option>
                <option value="Inglés">Inglés</option>
                <option value="Francés">Francés</option>
              </select>
            </div>

          </div>
        </aside>

        {/* LISTADO RESULTADOS */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           
           {/* Top bar de resultados y ordenación */}
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Mostrando <span style={{ color: 'var(--primary)' }}>{filteredAndSortedPros.length}</span> profesionales</h2>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                 <button onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} className="btn-outline mobile-filter-btn" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <SlidersHorizontal size={18} /> Filtros
                 </button>
                 
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <ArrowUpDown size={18} color="var(--text-muted)" />
                   <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '0.5rem', border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>
                     <option value="relevance">Recomendados / Nivel</option>
                     <option value="distance">Los más cerca de mí</option>
                     <option value="price_asc">Precio: Más baratos</option>
                     <option value="rating_desc">Mejor valorados</option>
                   </select>
                 </div>
              </div>
           </div>

           {/* Grid de Profesionales */}
           {filteredAndSortedPros.length === 0 ? (
             <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', marginTop: '2rem' }}>
               <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Vaya, no hay resultados</h3>
               <p style={{ color: 'var(--text-muted)' }}>Intenta ampliar tu radio de búsqueda o quitar filtros de precio e idioma.</p>
               <button className="btn-primary" onClick={() => { setFMaxDistance(50); setFMaxPrice(100); setFMinRating(0); setFType('Todos'); setFLang('Todos'); }} style={{ marginTop: '1.5rem' }}>
                 Resetear filtros
               </button>
             </div>
           ) : (
             <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
               {filteredAndSortedPros.map(pro => (
                 <Link to={`/profile/${pro.id}`} key={pro.id} className="card hover-up" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', overflow: 'hidden' }}>
                   
                   <div style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
                     <div style={{ position: 'relative' }}>
                       <img src={pro.avatar} alt={pro.name} style={{ width: '85px', height: '85px', borderRadius: '50%', objectFit: 'cover' }} />
                       <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', border: '2px solid white' }}>NVL {pro.level}</div>
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                         <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>{pro.name}</h3>
                       </div>
                       <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>{pro.category} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>• {pro.subcategory}</span></p>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', fontWeight: 700 }}>
                          <Star size={14} fill="#F59E0B" color="#F59E0B" style={{marginTop:'-2px'}} /> {pro.rating.toFixed(1)} 
                          <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8rem' }}>({pro.reviews})</span>
                       </div>
                     </div>
                   </div>

                   <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, flex: 1 }}>"{pro.desc}"</p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <MapPin size={16} /> a {pro.distance} km <span style={{opacity:0.6}}>• {pro.modality}</span>
                      </div>
                   </div>

                   <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                         <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>Desde</span>
                         <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>{pro.price}€<span style={{fontSize:'0.85rem', color:'var(--text-muted)', fontWeight:500}}>/clase</span></span>
                      </div>
                      <span className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 600 }}>Ver Perfil</span>
                   </div>

                 </Link>
               ))}
             </div>
           )}
        </main>
      </div>
    </div>
  );
}
