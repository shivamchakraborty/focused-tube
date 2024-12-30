import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Trash2, Edit2 } from 'lucide-react';
import { Creator } from '../types/creator';
import { useCreatorStore } from '../store/useCreatorStore';
import { useCategories } from '../hooks/useCategories';
import { useLatestVideos } from '../hooks/useYouTube';
import { EditCategoryModal } from './EditCategoryModal';

interface CreatorCardProps {
  creator: Creator;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  const navigate = useNavigate();
  const removeCreator = useCreatorStore((state) => state.removeCreator);
  const { getCategoryById } = useCategories();
  const { data: videos, isLoading } = useLatestVideos(creator.channelId);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const category = getCategoryById(creator.categoryId);
  const videoCount = videos?.pages?.[0]?.videos?.length || 0;
  const videoText = isLoading ? '' : `${videoCount} videos`;

  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <img
              src={creator.thumbnailUrl}
              alt={creator.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{creator.name}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <span
                    className="inline-block px-2 py-1 text-xs rounded-full text-white"
                    style={{ backgroundColor: category?.color }}
                  >
                    {category?.name}
                  </span>
                </div>
                {videoText && (
                  <p className="text-sm text-gray-500">
                    {videoText}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="text-red-500 hover:text-red-700 transition-colors p-2"
              aria-label="Edit creator category"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeCreator(creator.id);
              }}
              className="text-red-500 hover:text-red-700 transition-colors p-2"
              aria-label="Remove creator"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(`/creator/${creator.channelId}`)}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2"
              aria-label="View creator details"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <EditCategoryModal
        creator={creator}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};