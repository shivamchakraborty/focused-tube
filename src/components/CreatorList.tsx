import React from 'react';
import { Youtube } from 'lucide-react';
import { CreatorCard } from './CreatorCard';
import { Creator } from '../types/creator';

interface CreatorListProps {
  creators: Creator[];
  selectedCategory: string | null;
}

export const CreatorList: React.FC<CreatorListProps> = ({ creators, selectedCategory }) => {
  if (creators.length === 0) {
    return (
      <div className="text-center py-12">
        <Youtube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {selectedCategory ? 'No creators in this category' : 'No creators added yet'}
        </h2>
        <p className="text-gray-600">
          {selectedCategory
            ? 'Try selecting a different category or add new creators'
            : 'Add your favorite creators to start watching their content distraction-free.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-32 sm:pb-20">
      {creators.map((creator) => (
        <CreatorCard key={creator.id} creator={creator} />
      ))}
    </div>
  );
};