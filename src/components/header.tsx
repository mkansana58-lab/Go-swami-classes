"use client";

import { Home, PanelLeft, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { SidebarTrigger, useSidebar } from './ui/sidebar';

export function Header({showSidebarTrigger = true}: {showSidebarTrigger?: boolean}) {
  const { isMobile } = useSidebar();
  
  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showSidebarTrigger && isMobile && <SidebarTrigger />}
          <Link href="/" className="flex items-center gap-3 group">
            <Shield className="h-8 w-8 text-primary group-hover:animate-pulse" />
            <span className="text-xl font-bold font-headline text-primary hidden sm:inline-block">
              Go Swami Defence Academy
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
