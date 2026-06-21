'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

interface Wallpaper {
  id: string;
  prompt: string;
  imageUrl: string;
  category: string;
  timestamp: string;
  resolution: string;
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
    <main className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/" className="text-gray-400 hover:text-white">
          ← Back
        </Link>
        <h1 className="text-xl font-bold">Favorites</h1>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <FontAwesomeIcon icon={faHeart} className="text-3xl mb-2 text-gray-600" />
          <p>No favorites yet. Tap the heart on any wallpaper to save it.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {favorites.map(wp => (
            <Link key={wp.id} href={`/w/${wp.id}`} className="block rounded-lg overflow-hidden bg-gray-900 shadow">
              <img src={wp.imageUrl} alt={wp.prompt} className="w-full" style={{ aspectRatio: '9/16' }} />
              <div className="p-2">
                <p className="text-xs text-gray-400 truncate">{wp.category}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
