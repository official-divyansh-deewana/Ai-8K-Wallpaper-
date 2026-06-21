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
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selected === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
