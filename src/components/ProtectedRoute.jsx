import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--text-muted)' }}>
        Cargando sesión de usuario de forma segura...
      </div>
    );
  }

  // Si no está autenticado, redirigir a login, guardando de donde venía
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Control de Acceso Basado en Roles (RBAC)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si es pro y entra a zona de admin, etc. Lo enviamos a dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Si pasa las verificaciones, renderizar componente destino
  return children;
}
