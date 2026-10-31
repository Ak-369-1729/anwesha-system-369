'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="lost-signal">
      <span className="eyebrow">SYSTEM RECOVERY</span>
      <h1>
        A signal
        <br />
        interrupted.
      </h1>
      <p>Your exploration progress is stored locally. Reconnect to continue.</p>
      <button className="button primary" onClick={reset}>
        RECONNECT ↗
      </button>
      <a href="mailto:anwesha.hogwarts@gmail.com">Email Anwesha</a>
    </main>
  );
}
