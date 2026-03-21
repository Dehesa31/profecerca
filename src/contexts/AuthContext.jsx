import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulamos recuperar sesión persistente al abrir app (como middleware auth)
  useEffect(() => {
    const checkSession = () => {
      const storedSession = localStorage.getItem('profecerca_session');
      if (storedSession) {
        setUser(JSON.parse(storedSession));
      }
      setLoading(false);
    };
    // Pequeño delay simulando verificación de token backend
    setTimeout(checkSession, 500);
  }, []);

  const login = async (email, password, role) => {
    setLoading(true);
    // Simular llamada API
    await new Promise(res => setTimeout(res, 800));
    
    // El objeto usuario base (Tabla de usuarios separada del Perfil como pediste)
    const sessionUser = {
      id: `usr_${Date.now()}`,
      email: email || 'usuario@ejemplo.com',
      name: role === 'client' ? 'Juan Cliente' : (role === 'admin' ? 'Super Admin' : 'María Profesional'),
      role: role,
      avatar: `https://i.pravatar.cc/150?u=${role}`,
      onboarded: false, // Variable clave para redirigir tras login al flujo de onboarding
      phone_validated: role === 'pro' ? false : null,
      email_verified: true
    };

    localStorage.setItem('profecerca_session', JSON.stringify(sessionUser));
    setUser(sessionUser);
    setLoading(false);
    return sessionUser;
  };

  const register = async (email, password, role) => {
    return login(email, password, role); // Para el MVP de frontend reutilizamos la lógica auth mockeada
  };

  const completeOnboarding = async (profileData) => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 500));
    const updatedUser = { ...user, onboarded: true, profile: profileData };
    localStorage.setItem('profecerca_session', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('profecerca_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, completeOnboarding, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
