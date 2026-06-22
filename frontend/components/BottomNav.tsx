'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHeart } from '@fortawesome/free-solid-svg-icons';

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-3 bg-black/80 backdrop-blur-lg border-t border-white/5 shadow-2xl">
      <Link
        href="/"
        className={`flex flex-col items-center text-xs font-medium transition-colors ${
          pathname === '/' ? 'text-indigo-400' : 'text-gray-500 hover:text-white'
        }`}
      >
        <FontAwesomeIcon icon={faHome} className="text-xl mb-1" />
        Home
      </Link>
      <Link
        href="/favorites"
        className={`flex flex-col items-center text-xs font-medium transition-colors ${
          pathname === '/favorites' ? 'text-indigo-400' : 'text-gray-500 hover:text-white'
        }`}
      >
        <FontAwesomeIcon icon={faHeart} className="text-xl mb-1" />
        Saved
      </Link>
    </nav>
  );
}
