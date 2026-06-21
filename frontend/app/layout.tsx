import type { Metadata } from 'next';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';
import BottomNav from '@/components/BottomNav';

config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'AI Wallpaper Hub',
  description: 'Stunning AI-generated wallpapers for your Android phone',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased min-h-screen pb-20">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
