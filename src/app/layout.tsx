import type { Metadata } from 'next';
import { Belleza, Alegreya } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/header';
import './globals.css';
import { FacebookPixel } from '@/components/FacebookPixel';
import { Suspense } from 'react';

const belleza = Belleza({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-belleza',
});

const alegreya = Alegreya({
  subsets: ['latin'],
  variable: '--font-alegreya',
});

export const metadata: Metadata = {
  title: 'SlimWalk',
  description: 'Tu plan de caminata personalizado para una vida más saludable.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${belleza.variable} ${alegreya.variable}`}>
      <body>
          <Header />
          <main>{children}</main>
          <Toaster />
          <Suspense fallback={null}>
            <FacebookPixel />
          </Suspense>
      </body>
    </html>
  );
}
