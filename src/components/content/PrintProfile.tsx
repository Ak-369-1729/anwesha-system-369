'use client';
export default function PrintProfile() {
  return (
    <button className="button outline" onClick={() => window.print()}>
      PRINT PROFILE
    </button>
  );
}
