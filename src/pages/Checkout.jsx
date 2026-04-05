import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBookings } from '../contexts/BookingContext';
import { CreditCard, CheckCircle, ShieldCheck, Lock, Loader2, Bell } from 'lucide-react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { requestBooking } = useBookings();
  
  const bookingData = location.state?.bookingData;
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  if (!bookingData) {
    return (
       <div style={{textAlign:'center', padding:'4rem', display:'flex', flexDirection:'column', gap:'1rem', alignItems:'center'}}>
          <h2>Sesión de Pago Expirada</h2>
          <button onClick={() => navigate(-1)} className="btn-outline">Volver</button>
       </div>
    );
  }

  const price = bookingData.price || (bookingData.type === 'individual' ? 25 : 15);
  const targetName = bookingData.proName || 'Profesional';

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate Stripe/Redsys Processing Time
    setTimeout(() => {
      try {
        const newBooking = requestBooking({
           ...bookingData,
           paymentStatus: 'retenido' // Retenido como Escrow de Marketplace (fase 10)
        });
        setIsProcessing(false);
        setSuccess(true);
        setTimeout(() => setShowNotification(true), 500); // 500ms after success screen
        setTimeout(() => navigate('/dashboard'), 4000); // Wait 4s so user can read the notification
      } catch (err) {
        setIsProcessing(false);
        alert(err.message || "Error al procesar el pago");
        navigate(-1);
      }
    }, 2500);
  };

  if (success) {
    return (
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Fake System Push Notification */}
        <div style={{
          position: 'fixed', top: '20px', right: '20px', backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius-md)', 
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'flex-start',
          transform: showNotification ? 'translateX(0)' : 'translateX(120%)', transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', zIndex: 1000
        }}>
          <div style={{ backgroundColor: '#DBEAFE', padding: '0.5rem', borderRadius: '50%', flexShrink: 0 }}><Bell size={18} color="#2563EB" /></div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>ProfeCerca App</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hemos notificado a <strong>{targetName}</strong> de tu solicitud. Los fondos están garantizados.</p>
          </div>
        </div>

        <div style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center', padding: '3.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} className="glass-panel">
          <div style={{ width: '80px', height: '80px', backgroundColor: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <CheckCircle size={48} color="#10B981" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>¡Pago Autorizado!</h2>
          <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Tu reserva está en marcha. Los fondos han sido asegurados de forma segura.</p>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Redirigiendo a tu historial en unos segundos...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
       
       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#10B981' }}>
         <ShieldCheck size={28} />
         <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Pasarela de Pago Simulada</h1>
       </div>

       <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <div style={{ textAlign: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total a pagar (Sujeto a Confirmación)</span>
            <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>{price}€</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>Sesión de 45 min el {bookingData.date} a las {bookingData.time}</span>
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#FEF2F2', borderRadius: 'var(--radius-md)', border: '1px solid #FCA5A5' }}>
              <span style={{ fontSize: '0.85rem', color: '#B91C1C', fontWeight: 600 }}>Políticas de Cancelación Flexibles</span>
              <p style={{ fontSize: '0.8rem', color: '#7F1D1D', margin: '0.25rem 0 0 0' }}>Puedes cancelar gratis hasta 24 horas antes de la clase. Pasado este límite, asumiremos un recargo del 100% como penalización al profesional.</p>
            </div>
          </div>

          <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             
             <div>
               <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Titular de la tarjeta</label>
               <input type="text" placeholder="Ej: Maria Lopez" required style={{ width: '100%', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', background: '#F9FAFB' }} />
             </div>

             <div>
               <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Número de Tarjeta (Stripe Test)</label>
               <div style={{ position: 'relative' }}>
                 <input type="text" placeholder="4242 4242 4242 4242" required defaultValue="4242424242424242" style={{ width: '100%', padding: '1rem', paddingLeft: '3rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none', fontSize:'1.1rem', letterSpacing:'1px' }} />
                 <CreditCard size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
               </div>
             </div>

             <div style={{ display: 'flex', gap: '1rem' }}>
               <div style={{ flex: 1 }}>
                 <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Caducidad</label>
                 <input type="text" placeholder="MM/YY" required defaultValue="12/28" style={{ width: '100%', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none' }} />
               </div>
               <div style={{ flex: 1 }}>
                 <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>CVC</label>
                 <input type="text" placeholder="123" required defaultValue="123" style={{ width: '100%', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', outline: 'none' }} />
               </div>
             </div>

             <button type="submit" disabled={isProcessing} className="btn-primary" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: isProcessing ? 0.7 : 1, marginTop: '0.5rem' }}>
               {isProcessing ? <Loader2 className="spin" size={24} /> : <><Lock size={20} /> Pagar {price}€ de forma segura</>}
             </button>

             <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
               Estás realizando un pago en un entorno de pruebas autorizado. Los fondos quedarán <strong>Retenidos en Escrow</strong> hasta que {targetName} finalice o rechace el servicio para tu máxima seguridad.
             </p>
          </form>

       </div>
    </div>
  )
}
