import { Link, Outlet } from 'react-router-dom';

export function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          Wishlist
        </Link>
        <nav aria-label="Primary navigation">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
