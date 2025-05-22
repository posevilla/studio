import type { SVGProps } from 'react';

export function SitecsLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="40"
      height="40"
      fill="currentColor"
      aria-label="SITECS Logo"
      {...props}
    >
      <path d="M50,5 L90,25 L90,75 L50,95 L10,75 L10,25 Z M50,15 L80,30 L80,70 L50,85 L20,70 L20,30 Z" />
      <text x="50" y="60" fontSize="30" fontWeight="bold" textAnchor="middle" fill="currentColor">S</text>
    </svg>
  );
}
