import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="lost-signal">
      <span className="eyebrow">ERROR 404 // SIGNAL LOST</span>
      <h1>
        Uncharted
        <br />
        coordinates.
      </h1>
      <p>This transmission doesn’t have a destination yet.</p>
      <Link className="button primary" href="/">
        RETURN TO SYSTEM 369 ↗
      </Link>
    </main>
  );
}
