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
  const week = user?.dueDate ? getPregnancyWeek(user.dueDate) : 20;
  const trimester = getTrimester(week);

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-gray-200 bg-white h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 h-16 border-b border-gray-200">
        <span className="text-rose-400 text-xl">🌸</span>
        <span className="font-semibold text-gray-900 tracking-tight text-lg">bloom</span>
      </div>

      {/* Week badge */}
      <div className="px-4 pt-5 pb-4">
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
          <p className="text-xs text-gray-400 mb-0.5">You are in</p>
          <p className="text-gray-900 font-semibold text-sm">Week {week}</p>
          <p className="text-gray-500 text-xs">Trimester {trimester}</p>
          <div className="mt-2 bg-gray-100 rounded-full h-1.5 w-full">
            <div
              className="bg-rose-500 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round((week / 40) * 100))}%` }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-1">{week} of 40 weeks</p>
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
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Streak + Profile */}
      <div className="px-4 pb-5 pt-3 border-t border-gray-200 space-y-3">
        {/* Streak */}
        <div className="flex items-center gap-2 px-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{streak.currentStreak}</span>
            <span className="text-gray-400"> day streak</span>
          </span>
        </div>

        <Link
          href="/profile"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
            pathname === '/profile'
              ? 'bg-rose-500/10 text-rose-400 font-medium'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs transition-colors',
              pathname === href
                ? 'text-rose-400'
                : 'text-gray-400 hover:text-gray-600'
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
