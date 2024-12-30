import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getLatestVideos, searchChannel } from '../services/youtube';
import { Creator, Video } from '../types/creator';

export function useChannelSearch(query: string) {
  return useQuery({
    queryKey: ['channel', query],
    queryFn: async () => {
      if (!query) return null;
      return await searchChannel(query);
    },
    enabled: !!query,
  });
}

export function useLatestVideos(channelId: string) {
  return useInfiniteQuery({
    queryKey: ['videos', channelId],
    queryFn: ({ pageParam }) => getLatestVideos(channelId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    enabled: !!channelId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}