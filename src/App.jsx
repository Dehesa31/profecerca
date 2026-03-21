import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Book from './pages/Book';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Review from './pages/Review';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { ChatProvider } from './contexts/ChatContext';
import Agenda from './pages/Agenda';
import Checkout from './pages/Checkout';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
      <BookingProvider>
        <Router>
          <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile/:id" element={<Profile />} />
            
            {/* Vistas Protegidas Básicas (Cualquier usuario logueado) */}
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* Rutas exclusivas Profesional */}
            <Route path="/agenda" element={<ProtectedRoute allowedRoles={['pro']}><Agenda /></ProtectedRoute>} />
            
            {/* Vistas Protegidas Solo para Clientes (Reservas y Reseñas a profes) */}
            <Route path="/book/:id" element={<ProtectedRoute allowedRoles={['client']}><Book /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute allowedRoles={['client']}><Checkout /></ProtectedRoute>} />
            <Route path="/review/:id" element={<ProtectedRoute allowedRoles={['client']}><Review /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
      </BookingProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
