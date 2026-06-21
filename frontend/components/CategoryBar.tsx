'use client';

const CATEGORIES = [
  'All',
  'Nature',
  'Temple',
  'Anime',
  'Animals',
  'Adventure',
  'Horror',
  'Space',
  'Cyberpunk',
  'Abstract',
  'Minimal'
];

export default function CategoryBar({
  selected,
  onSelect
}: {
  selected: string;
  onSelect: (cat: string) => void;
}) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-2 pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 backdrop-blur-md border ${
              selected === cat
                ? 'bg-indigo-600/80 text-white border-indigo-400/50 shadow-lg shadow-indigo-500/20 scale-105'
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
