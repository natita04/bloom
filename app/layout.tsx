import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/providers/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bloom — Pregnancy tracker with a behavioral edge',
  description: 'Track your pregnancy with data-driven insights rooted in behavioral economics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <AuthProvider>{children}</AuthProvider>
        </body>
    </html>
  );
}
