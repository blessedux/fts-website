"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedHighlightProps {
  children: React.ReactNode
  index?: number
}

export function AnimatedHighlight({ children, index = 0 }: AnimatedHighlightProps) {
  return (
    <span className="relative inline-block">
      <motion.span
        className="absolute inset-0 bg-[#D4AF37] opacity-30"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{
          duration: 2.4,
          ease: [0.4, 0, 0.2, 1],
          delay: 1.6 + (index * 0.8)
        }}
        style={{
          borderRadius: '4px',
          padding: '0.2em 0.4em',
          margin: '-0.2em -0.4em',
          zIndex: 0
        }}
      />
      <span className="relative z-10 font-medium">{children}</span>
    </span>
  )
} 