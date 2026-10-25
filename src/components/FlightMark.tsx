export default function FlightMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <path d="M8 44 92 12 62 89 44 61Z" fill="#F7FAF5" />
      <path d="M8 44 92 12 44 61Z" fill="#FFFFFF" />
      <path d="M44 61 92 12 53 72 35 83Z" fill="#9FB8CA" />
      <path d="M44 61 62 89 92 12Z" fill="#D9E7E8" />
      <path d="m8 44 36 17 48-49" stroke="#FFFFFF" strokeWidth="1.4" />
      <path d="m35 83 9-22 9 11Z" fill="#6E8EAB" />
    </svg>
  );
}
