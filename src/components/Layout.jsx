import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: '2rem 1rem', minHeight: 'calc(100vh - 8rem)' }}>
        {children}
      </main>
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 0', marginTop: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="container">
          <p>© {new Date().getFullYear()} ProfeCerca. MVP Frontend App.</p>
        </div>
      </footer>
    </>
  );
}
