'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/food', label: 'Food', icon: '🍽️' },
    { href: '/workout', label: 'Workout', icon: '💪' },
    { href: '/board', label: 'Board', icon: '🏆' },
    { href: '/share', label: 'Share', icon: '👥' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-plum border-t border-[#2a1f2e] pb-safe">
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full relative ${
                isActive ? '' : 'opacity-60'
              }`}
            >
              {isActive && (
                <div className="absolute inset-x-2 top-2 bottom-2 bg-white/10 rounded-full" />
              )}
              <span className="text-xl mb-1 relative z-10">{item.icon}</span>
              <span className="text-xs text-cream relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
