import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="content-card" aria-labelledby="not-found-title">
      <h1 id="not-found-title">Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/">Return home</Link>
    </section>
  );
}
