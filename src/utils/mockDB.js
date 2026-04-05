export const seedDatabase = () => {
    // Si ya sembramos la base de datos simulada en localStorage, no la sobreescribimos
    if (localStorage.getItem('profecerca_seeded_v2') === 'true') return;
  
    // USUARIOS (Cuentas de acceso generales)
    const users = [
      { id: 'usr_client', email: 'cliente@test.com', password: '123', role: 'client', name: 'Laura Cliente', avatar: 'https://i.pravatar.cc/150?u=client' },
      { id: 'usr_pro_1', email: 'prodesporte@test.com', password: '123', role: 'pro', name: 'Carlos Martín', avatar: 'https://i.pravatar.cc/150?u=1' },
      { id: 'usr_pro_2', email: 'prococina@test.com', password: '123', role: 'pro', name: 'Elena Torres', avatar: 'https://i.pravatar.cc/150?u=4' },
      { id: 'usr_pro_3', email: 'proyoga@test.com', password: '123', role: 'pro', name: 'Laura Gómez', avatar: 'https://i.pravatar.cc/150?u=2' }
    ];
  
    // PERFILES PÚBLICOS DE LOS PROFESIONALES (Para Búsqueda y /profile)
    const profiles = [
      { 
          id: 'usr_pro_1', 
          name: 'Carlos Martín', 
          category: 'Pádel', 
          subcategory: 'Perfeccionamiento', 
          desc: 'Entrenador nacional experto en técnica. Clases intensas.', 
          rating: 4.9, 
          reviewsCount: 124, 
          distance: 2.5, 
          priceIndividual: 25, 
          priceGroup: 15, 
          maxGroupSize: 4, 
          type: 'ambos', 
          level: 5, 
          language: 'Español', 
          modalities: [{type: 'Pista Exterior', available:true}, {type: 'Domicilio Cliente', available: false}], 
          coords: {lat: 40.4168, lng: -3.7038}, 
          location: 'Madrid Centro, 28001',
          avatar: 'https://i.pravatar.cc/150?u=1', 
          classesCompleted: 340, 
          responseTime: '< 1 hora', 
          cancellationPolicy: '24 horas' 
      },
      { 
          id: 'usr_pro_2', 
          name: 'Elena Torres', 
          category: 'Cocina', 
          subcategory: 'Saludable', 
          desc: 'Aprende a cocinar rico, rápido y muy sano. Dieta Mediterránea.', 
          rating: 5.0, 
          reviewsCount: 200, 
          distance: 8.5, 
          priceIndividual: 35, 
          priceGroup: 20, 
          maxGroupSize: 10, 
          type: 'ambos', 
          level: 5, 
          language: 'Francés', 
          modalities: [{type: 'Casa Profesional', available:true}, {type: 'Domicilio Cliente', available: true}], 
          coords: {lat: 40.4800, lng: -3.6800}, 
          location: 'Madrid Norte, 28050',
          avatar: 'https://i.pravatar.cc/150?u=4', 
          classesCompleted: 150, 
          responseTime: '< 2 horas', 
          cancellationPolicy: '48 horas' 
      },
      { 
          id: 'usr_pro_3', 
          name: 'Laura Gómez', 
          category: 'Yoga', 
          subcategory: 'Vinyasa Meditación', 
          desc: 'Mindfulness y estiramientos profundos. Tu isla de paz mental.', 
          rating: 4.2, 
          reviewsCount: 30, 
          distance: 1.2, 
          priceIndividual: 20, 
          priceGroup: 10, 
          maxGroupSize: 8, 
          type: 'grupal', 
          level: 4, 
          language: 'Inglés', 
          modalities: [{type: 'Casa Profesional', available:true}, {type: 'Exterior', available: true}], 
          coords: {lat: 40.4500, lng: -3.6900}, 
          location: 'Madrid Cuatro Caminos, 28020',
          avatar: 'https://i.pravatar.cc/150?u=2', 
          classesCompleted: 80, 
          responseTime: '< 12 horas', 
          cancellationPolicy: '24 horas' 
      }
    ];
  
    // CONFIGURACIÓN DE AGENDA DE LOS PROFESIONALES
    const proSettings = {
      'usr_pro_1': { autoAccept: false, maxGroupSize: 4, availability: { default: ['09:00', '09:45', '17:00', '17:45', '18:30'], blocked: [] } },
      'usr_pro_2': { autoAccept: true, maxGroupSize: 10, availability: { default: ['11:00', '11:45', '19:00', '19:45'], blocked: [] } },
      'usr_pro_3': { autoAccept: false, maxGroupSize: 8, availability: { default: ['08:00', '08:45', '20:00', '20:45'], blocked: [] } }
    };
  
    // RESERVAS INICIALES (Para que haya datos jugables)
    const dStr = new Date().toISOString().split('T')[0];
    const bookings = [
      { id: 'bk_11', proId: 'usr_pro_1', proName: 'Carlos Martín', clientId: 'usr_client', date: dStr, time: '17:00', status: 'confirmada', type: 'individual', modality: 'Pista Exterior' },
      { id: 'bk_22', proId: 'usr_pro_2', proName: 'Elena Torres', clientId: 'usr_client', date: dStr, time: '19:00', status: 'pendiente', type: 'grupal', modality: 'Casa Profesional' }
    ];
  
    // Guardamos en LocalStorage
    localStorage.setItem('profecerca_users', JSON.stringify(users));
    localStorage.setItem('profecerca_profiles', JSON.stringify(profiles));
    localStorage.setItem('profecerca_settings', JSON.stringify(proSettings));
    localStorage.setItem('profecerca_bookings', JSON.stringify(bookings));
    localStorage.setItem('profecerca_channels', JSON.stringify([]));
  
    localStorage.setItem('profecerca_seeded_v2', 'true');
  };
