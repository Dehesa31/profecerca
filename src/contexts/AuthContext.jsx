import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  // Persistencia de base de datos Mock
  const getUsers = () => JSON.parse(localStorage.getItem('profecerca_users') || '[]');

  // Recupera la sesión al refrescar
  useEffect(() => {
    const savedUserId = localStorage.getItem('profecerca_session');
    if (savedUserId) {
      const users = getUsers();
      const loadedUser = users.find(u => u.id === savedUserId);
      if (loadedUser) setUser(loadedUser);
    }
  }, []);

  const login = (email, password) => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem('profecerca_session', found.id);
      return { success: true, role: found.role };
    }
    return { success: false, error: 'Credenciales inválidas o usuario no encontrado.' };
  };

  const register = (data) => {
    const users = getUsers();
    if (users.find(u => u.email === data.email)) {
      return { success: false, error: 'El email ya está registrado' };
    }
    
    // Asignar rol explícito si no viene
    const assignedRole = data.role || (data.isPro ? 'pro' : 'client');

    const newUser = {
      ...data,
      role: assignedRole,
      id: `usr_${Date.now()}`,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    };

    users.push(newUser);
    localStorage.setItem('profecerca_users', JSON.stringify(users));
    
    // Si crea una cuenta PRO, instanciamos mágicamente su Perfil Público y su Agenda
    if (assignedRole === 'pro') {
       const profiles = JSON.parse(localStorage.getItem('profecerca_profiles') || '[]');
       profiles.push({
          id: newUser.id, name: newUser.name, category: data.category || 'General', subcategory: 'Especialista', 
          desc: 'Nuevo profesional en la plataforma. Dispuesto a ayudarte a mejorar.', rating: 0, reviewsCount: 0, distance: 5.0, 
          priceIndividual: 20, priceGroup: 10, maxGroupSize: 5, type: 'ambos', level: 1, 
          language: 'Español', modalities: [{type: 'Exterior', available:true}], coords: {lat: 40.4, lng: -3.7}, 
          avatar: newUser.avatar, classesCompleted: 0, responseTime: '< 24 horas', cancellationPolicy: '24 horas'
       });
       localStorage.setItem('profecerca_profiles', JSON.stringify(profiles));

       const settings = JSON.parse(localStorage.getItem('profecerca_settings') || '{}');
       settings[newUser.id] = { autoAccept: true, maxGroupSize: 5, availability: { default: ['09:00', '10:00', '17:00'], blocked: [] } };
       localStorage.setItem('profecerca_settings', JSON.stringify(settings));
    }

    login(newUser.email, newUser.password);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('profecerca_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
