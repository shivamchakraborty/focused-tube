import React, { useState } from 'react';
import { useCreatorStore } from '../store/useCreatorStore';
import { CreatorList } from '../components/CreatorList';
import { AddCreator } from '../components/AddCreator';
import { CategoryFilter } from '../components/CategoryFilter';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useFirestoreSync } from '../hooks/useFirestore';

export function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const creators = useCreatorStore((state) => state.creators);
  const { loading, error } = useFirestoreSync();

  const filteredCreators = selectedCategory
    ? creators.filter((creator) => creator.categoryId === selectedCategory)
    : creators;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <CreatorList 
          creators={filteredCreators}
          selectedCategory={selectedCategory}
        />
      </main>

      <AddCreator />
    </div>
  );
}