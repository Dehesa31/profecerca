import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Calendar, MessageCircle, Award, CheckCircle2, Clock, Globe, Shield } from 'lucide-react';

export default function Profile() {
  const { id } = useParams();
  
  // Extraemos datos reales del semillero / base de datos
  const storedProfiles = JSON.parse(localStorage.getItem('profecerca_profiles') || '[]');
  const match = storedProfiles.find(p => p.id === id);

  if (!match) {
     return <div style={{textAlign:'center', padding:'4rem'}}>Perfil no encontrado. Puede que el profesional haya dado de baja su cuenta.</div>;
  }

  // Agregamos las propiedades dinámicas
  const pro = { ...match, badges: [] };

  // Lógica de Niveles (Fase 9 PRD)
  const reputationalBadge = pro.rating >= 4.8 && pro.classesCompleted > 100 
    ? '🌟 Top Profesional' 
    : pro.rating >= 4.0 
      ? '🏅 Destacado' 
      : 'Nuevo';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '6rem' }}>
      
      {/* 1. CABECERA (Header Visual) */}
      <div className="card" style={{ padding: '2rem', display: 'flex', gap: '2rem', flexDirection: 'column', '@media(minWidth: 640px)': { flexDirection: 'row' } }}>
        <img src={pro.avatar} alt={pro.name} style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', alignSelf: 'center', border: '4px solid var(--primary-light)' }} />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{pro.name}</h1>
              <p style={{ color: 'var(--primary-hover)', fontWeight: 600, fontSize: '1.1rem' }}>{pro.category}</p>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontWeight: 800, fontSize: '1.1rem' }}>
                <Star size={18} fill="#F59E0B" color="#F59E0B" style={{marginTop:'-2px'}} /> {pro.rating.toFixed(1)}
              </span>
              <a href="#reviews" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'underline' }}>{pro.reviewsCount} reseñas</a>
            </div>
          </div>
          
          {/* Métricas rápidas de impacto UX */}
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-main)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={16} color="var(--text-muted)"/> Área: {pro.zone}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Award size={16} color="var(--primary)"/> Nivel {pro.level}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle2 size={16} color="#10B981" /> {pro.classesCompleted} clases impartidas</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', backgroundColor: reputationalBadge.includes('Top') ? 'var(--primary)' : '#10B981', color: 'white', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0, 0.1)' }}>
              {reputationalBadge}
            </span>
            <span style={{ fontSize: '0.85rem', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
              🚀 Responde rápido
            </span>
          </div>
        </div>
      </div>
      
      {/* DOS COLUMNAS DE DETALLE */}
      <div style={{ display: 'grid', gap: '2.5rem', gridTemplateColumns: 'minmax(0, 1fr)', className: 'profile-layout' }}>
        
        {/* COLUMNA IZQUIERDA: Cuerpos descriptivos e información central */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <section>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Sobre mí</h3>
            <p style={{ color: 'var(--text-main)', lineHeight: 1.7, whiteSpace: 'pre-line', fontSize: '1rem' }}>{pro.description}</p>
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {pro.subcategories.map(sub => (
                <span key={sub} style={{ fontSize: '0.85rem', border: '1px solid var(--border-color)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {sub}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Mis Tarifas (45 min)</h3>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Clase Individual</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Toda la atención centrada en ti</p>
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{pro.priceIndividual}€</span>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Clase Grupal</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Ahorra compartiendo clase (máx {pro.maxGroupSize} p.)</p>
                </div>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{pro.priceGroup}€ <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/pers.</span></span>
              </div>
            </div>
          </section>

          <section id="reviews">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Reseñas ({pro.reviewsCount})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                     <strong>Ana García</strong>
                     <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hace 2 días</span>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}><Star size={14} fill="#FBBF24" color="#FBBF24" /> 5.0</span>
                  <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.5 }}>Excelente clase, muy dinámico y paciente. Aprendí muchísimo técnica de volea. Repetiré sin duda.</p>
               </div>
               
               <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                     <strong>David R.</strong>
                     <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hace 1 semana</span>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}><Star size={14} fill="#FBBF24" color="#FBBF24" /> 4.8</span>
                  <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.5 }}>Muy puntual y la pista elegida estaba en buenas condiciones. Recomiendo traer tu propia pala.</p>
               </div>
               
               <button className="btn-outline" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>Leer todas las {pro.reviewsCount} reseñas</button>
            </div>
          </section>

        </div>

        {/* COLUMNA DERECHA: Info Técnica de confianza y Call to actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--surface)' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Reglas y Detalles</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: 0, margin: 0 }}>
              
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Clock size={20} color="var(--primary)" style={{ marginTop: '2px' }}/>
                <div>
                  <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Respuesta promedio</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{pro.responseTime}</span>
                </div>
              </li>
              
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Globe size={20} color="var(--primary)" style={{ marginTop: '2px' }}/>
                <div>
                  <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Idiomas de la clase</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{pro.languages.join(' • ')}</span>
                </div>
              </li>
              
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Shield size={20} color="var(--primary)" style={{ marginTop: '2px' }}/>
                <div>
                  <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Política de Cancelación</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{pro.cancellationPolicy}</span>
                </div>
              </li>
              
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={20} color="var(--primary)" style={{ marginTop: '2px' }}/>
                <div>
                  <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>Modalidades que acepta</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
                    {pro.modalities.map(m => m.available && (
                      <span key={m.type} style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500}}><CheckCircle2 size={14} color="#10B981"/> {m.type}</span>
                    ))}
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="cta-sidebar" style={{ position: 'sticky', top: '5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <Link to={`/book/${pro.id}`} className="btn-primary" style={{ padding: '1.15rem', fontSize: '1.1rem', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
              <Calendar size={20} /> Ver Fechas Libres
            </Link>
            
            <Link to={`/chat?proId=${pro.id}&proName=${encodeURIComponent(pro.name)}`} className="btn-outline" style={{ padding: '1rem', justifyContent: 'center', background: 'var(--surface)', fontWeight: 600 }}>
              <MessageCircle size={20} /> Preguntar algo rápido
            </Link>
          </div>

        </div>
      </div>

      {/* STICKY BOTTOM BAR FOR MOBILE OVERRIDE */}
      <div className="mobile-sticky-bar" style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, 
        backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border-color)', 
        padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.08)', zIndex: 100
      }}>
        <div>
          <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800 }}>{pro.priceIndividual}€ <span style={{fontSize:'0.85rem', fontWeight:400, color:'var(--text-muted)'}}>/45m</span></span>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{pro.rating} ★ ({pro.reviewsCount})</span>
        </div>
        <Link to={`/book/${pro.id}`} className="btn-primary" style={{ padding: '0.8rem 1.75rem', fontSize: '1.05rem' }}>
          Reservar
        </Link>
      </div>

    </div>
  );
}
