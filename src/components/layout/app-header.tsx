import Link from 'next/link';
import { SitecsLogo } from '@/components/icons/sitecs-logo';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <SitecsLogo className="h-8 w-8 text-primary" />
          <span className="font-bold sm:inline-block text-lg">
            SITECS Triage Assist
          </span>
        </Link>
      </div>
    </header>
  );
}
