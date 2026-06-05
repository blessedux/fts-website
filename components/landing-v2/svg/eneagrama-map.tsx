type EneagramaMapProps = {
  className?: string
  /** `light` — ivory lines on dark backgrounds; `dark` — brown lines on light backgrounds */
  tone?: "light" | "dark"
}

/** Eneagrama como mapa — sin trazos claros que lean como borde blanco */
export function EneagramaMap({
  className = "",
  tone = "dark",
}: EneagramaMapProps) {
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

  const palette =
    tone === "light"
      ? {
          line: "#f2ebe3",
          nodeFill: "rgba(242, 235, 227, 0.14)",
          nodeStroke: "#f2ebe3",
          nodeText: "#6a4128",
          label: "rgba(242, 235, 227, 0.7)",
        }
      : {
          line: "#3d2316",
          nodeFill: "rgba(37, 17, 5, 0.88)",
          nodeStroke: "none",
          nodeText: "#967e66",
          label: "#6a4128",
        }

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
        stroke={palette.line}
        strokeWidth="0.6"
        strokeDasharray="3 7"
        fill="none"
        opacity={tone === "light" ? 0.55 : 0.35}
      />
      <circle
        cx="200"
        cy="200"
        r="90"
        stroke={palette.line}
        strokeWidth="0.5"
        fill="none"
        opacity={tone === "light" ? 0.4 : 0.25}
      />
      {lines.map(([a, b], i) => (
        <line
          key={i}
          x1={points[a].cx}
          y1={points[a].cy}
          x2={points[b].cx}
          y2={points[b].cy}
          stroke={palette.line}
          strokeWidth="0.6"
          opacity={tone === "light" ? 0.7 : 0.45}
        />
      ))}
      {points.map(({ cx, cy, n }) => (
        <g key={n}>
          <circle
            cx={cx}
            cy={cy}
            r="14"
            stroke={palette.nodeStroke}
            strokeWidth={tone === "light" ? 0.75 : 0}
            fill={palette.nodeFill}
          />
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            fill={palette.nodeText}
            fontSize="11"
            fontFamily="Georgia, serif"
            fontWeight={tone === "light" ? 600 : 400}
          >
            {n}
          </text>
        </g>
      ))}
      <text
        x="200"
        y="385"
        textAnchor="middle"
        fill={palette.label}
        fontSize="10"
        letterSpacing="4"
        opacity={tone === "light" ? 0.85 : 0.55}
      >
        MAPA
      </text>
    </svg>
  )
}
