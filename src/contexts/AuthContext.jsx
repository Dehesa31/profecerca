import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null means not logged in
  
  // mock login
  const login = (role) => {
    setUser({
      id: role === 'client' ? 'c_123' : 'p_456',
      name: role === 'client' ? 'Juan Cliente' : 'María Profesional',
      role: role,
      avatar: `https://i.pravatar.cc/150?u=${role}`
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
