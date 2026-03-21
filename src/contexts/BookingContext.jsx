import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  // Estado global simulado para las reservas
  const [bookings, setBookings] = useState([
    { id: 'b1', proId: '1', clientId: 'usr_dummy', date: new Date().toISOString().split('T')[0], time: '10:00', status: 'confirmada', type: 'individual', modality: 'Pista Exterior' },
    { id: 'b2', proId: '1', clientId: 'usr_dummy_2', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '17:00', status: 'pendiente', type: 'grupal', modality: 'Domicilio' }
  ]);

  // Configuraciones simuladas de los profesionales
  const [proSettings, setProSettings] = useState({
    '1': {
      autoAccept: false,
      maxGroupSize: 4,
      availability: {
        // Horarios estándar del profesional (simplificado para MVP)
        default: ['09:00', '09:45', '10:30', '11:15', '16:00', '16:45', '17:30', '18:15'],
        // Franjas bloqueadas manualmente ('YYYY-MM-DD-HH:MM')
        blocked: [`${new Date().toISOString().split('T')[0]}-09:00`]
      }
    }
  });

  const getAvailableSlots = (proId, dateString) => {
    const settings = proSettings[proId] || proSettings['1'];
    const allSlots = settings.availability.default;
    
    return allSlots.map(time => {
      const slotKey = `${dateString}-${time}`;
      const isBlocked = settings.availability.blocked.includes(slotKey);
      
      const existingBookings = bookings.filter(b => b.proId === proId && b.date === dateString && b.time === time && !b.status.startsWith('cancelada') && b.status !== 'no_show');
      
      let isAvailableForIndividual = !isBlocked;
      let isAvailableForGrupal = !isBlocked;
      let spotCount = 0;

      if (existingBookings.length > 0) {
        const hasIndividual = existingBookings.some(b => b.type === 'individual');
        if (hasIndividual) {
          isAvailableForIndividual = false;
          isAvailableForGrupal = false;
        } else {
          spotCount = existingBookings.filter(b => b.type === 'grupal').length;
          isAvailableForIndividual = false; // Cannot book individually if at least one grupal spot is taken
          if (spotCount >= settings.maxGroupSize) {
            isAvailableForGrupal = false; // Class is full
          }
        }
      }

      return {
        time,
        isAvailableForIndividual,
        isAvailableForGrupal,
        groupSpotsTaken: spotCount,
        maxSpots: settings.maxGroupSize
      };
    });
  };

  const requestBooking = (bookingData) => {
    const settings = proSettings[bookingData.proId] || proSettings['1'];
    // Validar de nuevo por seguridad
    const availableSlots = getAvailableSlots(bookingData.proId, bookingData.date);
    const slot = availableSlots.find(s => s.time === bookingData.time);
    
    if (!slot) throw new Error("La franja ya no está disponible.");

    const canBook = bookingData.type === 'individual' ? slot.isAvailableForIndividual : slot.isAvailableForGrupal;
    if (!canBook) throw new Error("La franja acaba de ser ocupada o ya no admite tu modalidad.");

    const newBooking = {
      ...bookingData,
      id: `bk_${Date.now()}`,
      status: settings.autoAccept ? 'confirmada' : 'pendiente'
    };

    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  };

  const updateBookingStatus = (bookingId, newStatus, meta = {}) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? {
      ...b,
      status: newStatus,
      cancellationLog: newStatus.startsWith('cancelada') || newStatus.startsWith('no_show') 
          ? { timestamp: new Date().toISOString(), ...meta } 
          : b.cancellationLog
    } : b));
  };
  
  const toggleBlockSlot = (proId, dateString, time) => {
    setProSettings(prev => {
      const pro = prev[proId] || prev['1']; // fallback mock
      const key = `${dateString}-${time}`;
      const currentlyBlocked = pro.availability.blocked.includes(key);
      
      return {
        ...prev,
        [proId]: {
          ...pro,
          availability: {
            ...pro.availability,
            blocked: currentlyBlocked 
              ? pro.availability.blocked.filter(b => b !== key)
              : [...pro.availability.blocked, key]
          }
        }
      };
    });
  };

  const addReview = (bookingId, role, rating, comment) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const existingReviews = b.reviews || [];
        return {
          ...b,
          reviews: [...existingReviews, { role, rating, comment, date: new Date().toISOString() }]
        };
      }
      return b;
    }));
  };

  return (
    <BookingContext.Provider value={{ bookings, proSettings, getAvailableSlots, requestBooking, updateBookingStatus, toggleBlockSlot, addReview }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBookings = () => useContext(BookingContext);
