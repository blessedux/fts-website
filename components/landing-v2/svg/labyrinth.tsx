/** Laberinto visto desde arriba — CTA final */
export function LabyrinthTopView({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="200" cy="200" r="185" stroke="#4a2f1c" strokeWidth="0.5" opacity="0.3" />
      {[180, 150, 120, 90, 60].map((r, i) => (
        <path
          key={r}
          stroke="#6a4128"
          strokeWidth={0.5 + i * 0.05}
          opacity={0.25 + i * 0.08}
          fill="none"
          d={`M 200 ${200 - r} A ${r} ${r} 0 0 1 200 ${200 + r} A ${r} ${r} 0 0 1 200 ${200 - r}`}
          strokeDasharray={i % 2 === 0 ? "4 8" : "none"}
        />
      ))}
      <path
        stroke="#967e66"
        strokeWidth="0.8"
        opacity="0.5"
        fill="none"
        d="M200 20 L200 80 L120 80 L120 160 L280 160 L280 240 L80 240 L80 320 L320 320 L320 120 L160 120 L160 200 L240 200 L240 280 L140 280 L140 360 L260 360 L260 60 L200 60"
      />
      <circle cx="200" cy="200" r="8" fill="#6a4128" opacity="0.6" />
      <circle cx="200" cy="200" r="3" fill="#f2ebe3" opacity="0.9" />
    </svg>
  )
}
