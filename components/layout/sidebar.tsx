'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useBloomStore } from '@/lib/store';
import { getPregnancyWeek, getTrimester } from '@/lib/utils/pregnancy';
import {
  LayoutDashboard,
  BookHeart,
  LineChart,
  CheckSquare,
  Brain,
  User,
  Flame,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/log', label: 'Daily Log', icon: BookHeart },
  { href: '/insights', label: 'Insights', icon: LineChart },
  { href: '/milestones', label: 'Milestones', icon: CheckSquare },
  { href: '/drives', label: 'What Drives Me', icon: Brain },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, streak } = useBloomStore();
  const week = user ? getPregnancyWeek(user.dueDate) : 20;
  const trimester = getTrimester(week);

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-zinc-800 bg-zinc-950 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 h-16 border-b border-zinc-800">
        <span className="text-rose-400 text-xl">🌸</span>
        <span className="font-semibold text-white tracking-tight text-lg">bloom</span>
      </div>

      {/* Week badge */}
      <div className="px-4 pt-5 pb-4">
        <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
          <p className="text-xs text-zinc-500 mb-0.5">You are in</p>
          <p className="text-white font-semibold text-sm">Week {week}</p>
          <p className="text-zinc-400 text-xs">Trimester {trimester}</p>
          <div className="mt-2 bg-zinc-800 rounded-full h-1.5 w-full">
            <div
              className="bg-rose-500 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round((week / 40) * 100))}%` }}
            />
          </div>
          <p className="text-zinc-600 text-xs mt-1">{week} of 40 weeks</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-rose-500/10 text-rose-400 font-medium'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Streak + Profile */}
      <div className="px-4 pb-5 pt-3 border-t border-zinc-800 space-y-3">
        {/* Streak */}
        <div className="flex items-center gap-2 px-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-zinc-300">
            <span className="font-semibold text-white">{streak.currentStreak}</span>
            <span className="text-zinc-500"> day streak</span>
          </span>
        </div>

        <Link
          href="/profile"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
            pathname === '/profile'
              ? 'bg-rose-500/10 text-rose-400 font-medium'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          )}
        >
          <User className="w-4 h-4 shrink-0" />
          Profile
        </Link>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs transition-colors',
              pathname === href
                ? 'text-rose-400'
                : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="truncate">{label.split(' ')[0]}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
