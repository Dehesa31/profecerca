import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  
  // Leemos desde persistencia real local (Mock DB conectada al Vercel del cliente)
  const [bookings, setBookingsState] = useState(() => JSON.parse(localStorage.getItem('profecerca_bookings') || '[]'));
  const [proSettings, setProSettingsState] = useState(() => JSON.parse(localStorage.getItem('profecerca_settings') || '{}'));

  // Custom setters para persistir siempre en LocalStorage al mutar (para que cierre el navegador y no lo pierda)
  const setBookings = (updater) => {
     setBookingsState(prev => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        localStorage.setItem('profecerca_bookings', JSON.stringify(next));
        return next;
     });
  };

  const setProSettings = (updater) => {
     setProSettingsState(prev => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        localStorage.setItem('profecerca_settings', JSON.stringify(next));
        return next;
     });
  };

  const getAvailableSlots = (proId, dateString) => {
    // Si no tiene configurada o es nuevo pro, crearle un array en blanco para q no crashee
    const settings = proSettings[proId] || { availability: { default: ['09:00', '10:00','17:00', '18:00'], blocked: [] }, maxGroupSize: 5 };
    const allSlots = settings.availability.default || [];
    
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
          isAvailableForIndividual = false; 
          if (spotCount >= settings.maxGroupSize) {
            isAvailableForGrupal = false; 
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
    const settings = proSettings[bookingData.proId] || { autoAccept: true };
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
      const pro = prev[proId] || { availability: { default: ['09:00', '10:00','17:00','18:00'], blocked: [] }, maxGroupSize: 5 };
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
    setBookings(prev => {
      let bookingTarget;
      const nextBookings = prev.map(b => {
        if (b.id === bookingId) {
          bookingTarget = b;
          const existingReviews = b.reviews || [];
          return {
            ...b,
            reviews: [...existingReviews, { role, rating, comment, date: new Date().toISOString() }]
          };
        }
        return b;
      });

      // Simular actualización del Rating Público del Profesional
      if (bookingTarget && role === 'client') {
        const profiles = JSON.parse(localStorage.getItem('profecerca_profiles') || '[]');
        const updatedProfiles = profiles.map(p => {
           if (p.id === bookingTarget.proId) {
              const newTotal = (p.rating * p.reviewsCount) + rating;
              const newCount = p.reviewsCount + 1;
              return { ...p, rating: parseFloat((newTotal / newCount).toFixed(1)), reviewsCount: newCount };
           }
           return p;
        });
        localStorage.setItem('profecerca_profiles', JSON.stringify(updatedProfiles));
      }

      return nextBookings;
    });
  };

  return (
    <BookingContext.Provider value={{ bookings, proSettings, getAvailableSlots, requestBooking, updateBookingStatus, toggleBlockSlot, addReview }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBookings = () => useContext(BookingContext);
