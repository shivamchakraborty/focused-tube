import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Youtube } from 'lucide-react';
import { useCreatorStore } from '../store/useCreatorStore';
import { useLatestVideos } from '../hooks/useYouTube';
import { VideoList } from '../components/VideoList';
import { VideoPlayer } from '../components/VideoPlayer';
import { Video } from '../types/creator';

export function CreatorPage() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const creators = useCreatorStore((state) => state.creators);
  const creator = creators.find((c) => c.channelId === channelId);
  const { 
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useLatestVideos(channelId || '');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  if (!creator) {
    return null;
  }

  const allVideos = data?.pages.flatMap(page => page.videos) || [];
  const allShorts = data?.pages.flatMap(page => page.shorts) || [];

  const handleVideoSelect = (videoId: string) => {
    const video = [...allVideos, ...allShorts].find((v) => v.videoId === videoId);
    if (video) {
      setSelectedVideo(video);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark transition-colors">
      <header className="bg-white dark:bg-dark-lighter shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src={creator.thumbnailUrl}
                  alt={creator.name}
                  className="w-10 h-10 rounded-full"
                />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {creator.name}
                </h1>
              </div>
            </div>
            <Youtube className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VideoList
          videos={allVideos}
          shorts={allShorts}
          onVideoSelect={handleVideoSelect}
          isLoading={isLoading}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </main>

      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}