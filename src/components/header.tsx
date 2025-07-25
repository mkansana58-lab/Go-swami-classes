import { Shield } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Shield className="h-8 w-8 text-primary group-hover:animate-pulse" />
          <span className="text-xl font-bold font-headline text-primary">
            Go Swami Defence Academy
          </span>
        </Link>
      </div>
    </header>
  );
}
