
'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from 'lucide-react';

export function DarkModeToggle() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // This effect runs once on mount to determine the initial theme
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let initialIsDark = false;

    if (storedTheme === 'dark') {
      initialIsDark = true;
    } else if (storedTheme === 'light') {
      initialIsDark = false;
    } else {
      initialIsDark = systemPrefersDark; // Default to system preference if no stored theme
    }

    setIsDarkMode(initialIsDark);
    if (initialIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setIsMounted(true); // Indicate that we're now safe to render the switch
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    if (newIsDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!isMounted) {
    // Render a placeholder to prevent layout shift and hydration errors
    // Approx size: Sun(20px) + space(8px) + Switch(44px) + space(8px) + Moon(20px) = 100px width. Height ~24px.
    return <div className="flex items-center space-x-2 h-6 w-[100px]" />;
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className={`h-5 w-5 transition-colors ${!isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
      <Switch
        id="theme-switch"
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <Moon className={`h-5 w-5 transition-colors ${isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
    </div>
  );
}
