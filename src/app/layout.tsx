import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'San Francisco Softball Meetup',
  description: 'Stats for the San Francisco Softball Meetup pickup games',
};

const navLinks = [
  { href: '/stats', label: 'Stats' },
  { href: '/games', label: 'Games' },
  { href: '/admin', label: 'Admin' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="bg-green-800 text-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold tracking-tight">
              ⚾ SF Softball Meetup
            </Link>
            <nav className="flex gap-5 text-sm">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} className="hover:underline">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
