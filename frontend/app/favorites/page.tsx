'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface Wallpaper {
  id: string;
  prompt: string;
  imageUrl: string;
  category: string;
  timestamp: string;
  resolution: string;
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl overflow-hidden bg-black border border-white/5" style={{ aspectRatio: '9/16' }}>
      <div className="w-full h-full animate-shimmer" />
    </div>
  );
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedFavs = JSON.parse(localStorage.getItem('ai_wallpaper_favs') || '[]');
    if (storedFavs.length === 0) {
      setLoading(false);
      return;
    }
    Promise.all(
      storedFavs.map((id: string) =>
        fetch(`/api/wallpapers?action=get&id=${id}`).then(res => res.json())
      )
    ).then(results => {
      setFavorites(results.filter(r => !r.error));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-md mx-auto px-4 pt-8 pb-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
        </Link>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
          Your Saved Wallpapers
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-4">
            <FontAwesomeIcon icon={faHeart} className="text-3xl text-gray-600" />
          </div>
          <p className="text-gray-400 text-sm">No saved wallpapers yet.</p>
          <p className="text-gray-600 text-xs mt-1">Tap the heart on any wallpaper to save it.</p>
          <Link
            href="/"
            className="mt-6 inline-block px-6 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white text-sm font-semibold rounded-full transition-colors"
          >
            Discover Wallpapers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {favorites.map(wp => (
            <Link
              key={wp.id}
              href={`/w/${wp.id}`}
              className="group relative rounded-3xl overflow-hidden bg-black shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-shadow duration-500"
              style={{ aspectRatio: '9/16' }}
            >
              <img
                src={wp.imageUrl}
                alt={wp.prompt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <span className="text-xs font-medium bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-white">
                  {wp.category}
                </span>
                <FontAwesomeIcon icon={faHeart} className="text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
