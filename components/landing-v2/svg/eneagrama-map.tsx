/** Eneagrama como mapa — sin trazos claros que lean como borde blanco */
export function EneagramaMap({ className = "" }: { className?: string }) {
  const points = Array.from({ length: 9 }, (_, i) => {
    const angle = (i * 40 - 90) * (Math.PI / 180)
    const cx = 200 + 120 * Math.cos(angle)
    const cy = 200 + 120 * Math.sin(angle)
    return { cx, cy, n: i + 1 }
  })

  const lines = [
    [0, 3],
    [3, 5],
    [5, 7],
    [7, 1],
    [1, 4],
    [4, 6],
    [6, 8],
    [8, 2],
    [2, 0],
    [0, 5],
    [2, 7],
    [4, 8],
  ]

  const lineColor = "#3d2316"
  const nodeFill = "rgba(37, 17, 5, 0.88)"
  const nodeText = "#967e66"

  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      aria-hidden
    >
      <circle cx="200" cy="200" r="140" stroke="none" fill="none" opacity="0" />
      <circle
        cx="200"
        cy="200"
        r="140"
        stroke={lineColor}
        strokeWidth="0.6"
        strokeDasharray="3 7"
        fill="none"
        opacity="0.35"
      />
      <circle
        cx="200"
        cy="200"
        r="90"
        stroke={lineColor}
        strokeWidth="0.5"
        fill="none"
        opacity="0.25"
      />
      {lines.map(([a, b], i) => (
        <line
          key={i}
          x1={points[a].cx}
          y1={points[a].cy}
          x2={points[b].cx}
          y2={points[b].cy}
          stroke={lineColor}
          strokeWidth="0.6"
          opacity="0.45"
        />
      ))}
      {points.map(({ cx, cy, n }) => (
        <g key={n}>
          <circle cx={cx} cy={cy} r="14" stroke="none" fill={nodeFill} />
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            fill={nodeText}
            fontSize="11"
            fontFamily="Georgia, serif"
          >
            {n}
          </text>
        </g>
      ))}
      <text
        x="200"
        y="385"
        textAnchor="middle"
        fill="#6a4128"
        fontSize="10"
        letterSpacing="4"
        opacity="0.55"
      >
        MAPA
      </text>
    </svg>
  )
}
