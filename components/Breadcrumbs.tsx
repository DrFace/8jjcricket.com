// components/Breadcrumbs.tsx
"use client";

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
}

export default function Breadcrumbs({ items, showHome = true }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbs = items || generateBreadcrumbs(pathname);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-sky-100/60 mb-4">
      {showHome && (
        <>
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-india-gold transition-colors"
            aria-label="Home"
          >
            <Home size={14} />
            <span>Home</span>
          </Link>
          <ChevronRight size={14} className="text-white/30" />
        </>
      )}

      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-india-gold transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-india-gold font-semibold' : ''}>
                {item.label}
              </span>
            )}

            {!isLast && <ChevronRight size={14} className="text-white/30" />}
          </div>
        );
      })}
    </nav>
  );
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  
  return segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return { label, href };
  });
}
