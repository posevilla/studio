
import Link from 'next/link';
import Image from 'next/image';
// import { SitecsLogo } from '@/components/icons/sitecs-logo'; // No longer needed
import { DarkModeToggle } from './dark-mode-toggle';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image
            src="/images/sitecs-app-logo.png"
            alt="SITECS App Logo"
            width={40}
            height={40}
            className="h-10 w-10"
            data-ai-hint="app logo"
          />
          <span className="font-bold sm:inline-block text-lg">
            S.I.T.E.C.S Sistema Integral de Triaje para Evacuación de Centros Sanitarios - Aplicación de Ayuda
          </span>
        </Link>
        <div className="ml-auto flex items-center">
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
