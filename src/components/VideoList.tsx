import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Play, Clock, Eye, Loader2, Video as VideoIcon } from 'lucide-react';
import { Video } from '../types/creator';
import { formatDuration, formatViews } from '../utils/formatters';
import { cn } from '../lib/utils';

interface VideoListProps {
  videos: Video[];
  shorts: Video[];
  onVideoSelect: (videoId: string) => void;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

type ContentType = 'videos' | 'shorts';

export const VideoList: React.FC<VideoListProps> = ({
  videos,
  shorts,
  onVideoSelect,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) => {
  const [activeTab, setActiveTab] = useState<ContentType>('videos');
  const [shortsLimit, setShortsLimit] = useState(6);

  const sortByDate = (items: Video[]) => {
    return [...items].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  };

  const sortedVideos = sortByDate(videos);
  const sortedShorts = sortByDate(shorts);
  const displayedShorts = sortedShorts.slice(0, shortsLimit);
  const hasMoreShorts = shortsLimit < sortedShorts.length;

  const handleLoadMoreShorts = () => {
    setShortsLimit(prev => prev + 6);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className="bg-gray-200 dark:bg-gray-700 rounded w-full h-48"></div>
          </div>
        ))}
      </div>
    );
  }

  const currentContent = activeTab === 'videos' ? sortedVideos : displayedShorts;
  const isEmpty = currentContent.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('videos')}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2',
            activeTab === 'videos'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          <VideoIcon className="w-4 h-4" />
          <span>Videos ({videos.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('shorts')}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            activeTab === 'shorts'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          Shorts ({shorts.length})
        </button>
      </div>

      {isEmpty ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No {activeTab} available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentContent.map((video) => (
            <div
              key={video.id}
              className="bg-white dark:bg-dark-card rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onVideoSelect(video.videoId)}
            >
              <div className="relative group aspect-video">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
                  {formatDuration(video.duration || '')}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                  {video.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatViews(video.viewCount || '0')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatDistanceToNow(new Date(video.publishedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'videos' && hasNextPage && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading more...</span>
              </>
            ) : (
              <span>Load More Videos</span>
            )}
          </button>
        </div>
      )}

      {activeTab === 'shorts' && hasMoreShorts && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMoreShorts}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
          >
            <span>Load More Shorts</span>
          </button>
        </div>
      )}
    </div>
  );
};