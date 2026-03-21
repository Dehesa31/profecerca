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
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/book/:id" element={<Book />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/review/:id" element={<Review />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
