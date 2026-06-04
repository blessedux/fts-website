export function ConstellationBg({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g opacity="0.5" stroke="#967e66" strokeWidth="0.5">
        <line x1="120" y1="80" x2="200" y2="140" />
        <line x1="200" y1="140" x2="280" y2="100" />
        <line x1="280" y1="100" x2="340" y2="180" />
        <line x1="500" y1="60" x2="580" y2="120" />
        <line x1="580" y1="120" x2="640" y2="80" />
        <line x1="640" y1="80" x2="720" y2="160" />
        <line x1="80" y1="320" x2="160" y2="380" />
        <line x1="160" y1="380" x2="240" y2="340" />
        <line x1="600" y1="400" x2="680" y2="460" />
        <line x1="680" y1="460" x2="760" y2="420" />
      </g>
      {[
        [120, 80],
        [200, 140],
        [280, 100],
        [340, 180],
        [500, 60],
        [580, 120],
        [640, 80],
        [720, 160],
        [80, 320],
        [160, 380],
        [240, 340],
        [600, 400],
        [680, 460],
        [760, 420],
        [400, 250],
        [420, 280],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          className="lv2-star"
          cx={cx}
          cy={cy}
          r={i % 3 === 0 ? 2 : 1.2}
          fill="#967e66"
          opacity={0.5 + (i % 4) * 0.1}
        />
      ))}
    </svg>
  )
}
