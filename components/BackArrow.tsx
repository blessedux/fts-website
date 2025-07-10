import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function BackArrow({ href = '/', className = '' }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-primary hover:text-[#D4AF37] transition-colors text-lg font-medium p-2 rounded-full bg-white/80 shadow-md absolute top-4 left-4 z-50 ${className}`}
      aria-label="Volver atrás"
    >
      <ArrowLeft className="h-6 w-6" />
      <span className="hidden sm:inline">Volver</span>
    </Link>
  );
} 