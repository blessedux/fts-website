/** Grabado estilizado: figura ante el reflejo */
export function EngravingReflection({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      pointerEvents="none"
    >
      <ellipse cx="160" cy="400" rx="120" ry="12" stroke="#4a2f1c" strokeWidth="0.5" opacity="0.5" />
      <path
        className="lv2-engraving-stroke"
        d="M160 60 C120 60 95 100 95 150 C95 200 120 240 160 250 C200 240 225 200 225 150 C225 100 200 60 160 60 Z"
      />
      <path
        className="lv2-engraving-stroke"
        d="M130 150 Q160 170 190 150"
      />
      <path
        className="lv2-engraving-stroke"
        d="M160 250 L160 320"
      />
      <path
        className="lv2-engraving-stroke"
        d="M120 320 L200 320"
      />
      <path
        className="lv2-engraving-stroke"
        d="M100 340 L220 340"
      />
      {/* Espejo / agua */}
      <ellipse cx="160" cy="360" rx="90" ry="28" stroke="#967e66" strokeWidth="0.6" opacity="0.4" />
      <path
        className="lv2-engraving-stroke"
        d="M160 280 C130 300 110 330 110 360 C110 390 130 400 160 400 C190 400 210 390 210 360 C210 330 190 300 160 280"
        opacity="0.6"
      />
      <path
        stroke="#967e66"
        strokeWidth="0.4"
        opacity="0.35"
        d="M140 370 Q160 375 180 370 M135 385 Q160 392 185 385"
      />
      {/* Marco decorativo */}
      <rect x="40" y="30" width="240" height="360" stroke="#4a2f1c" strokeWidth="0.5" opacity="0.25" />
      <path d="M40 30 L55 30 M40 30 L40 45 M280 30 L265 30 M280 30 L280 45" stroke="#967e66" strokeWidth="0.6" opacity="0.5" />
    </svg>
  )
}
