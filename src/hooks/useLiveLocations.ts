import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { liveLocationsApi } from '@/services/api/liveLocationsApi';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { LiveLocation } from '@/services/types';

export type { LiveLocation } from '@/services/types';

export function useLiveLocations() {
  const [liveLocations, setLiveLocations] = useState<LiveLocation[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useAuth();
  const watchIdRef = useRef<number | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Fetch initial live locations via API
  const fetchLiveLocations = useCallback(async () => {
    const response = await liveLocationsApi.getAll();

    if (!response.success) {
      console.error('Error fetching live locations:', response.error);
    } else {
      setLiveLocations(response.data || []);
    }
  }, []);

  // Subscribe to realtime updates (this still uses Supabase client for WebSocket)
  useEffect(() => {
    fetchLiveLocations();

    channelRef.current = supabase
      .channel('live-locations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_locations',
        },
        () => {
          fetchLiveLocations();
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [fetchLiveLocations]);

  // Update user's live location via API
  const updateMyLocation = useCallback(async (latitude: number, longitude: number) => {
    if (!user) return;

    const response = await liveLocationsApi.update({ latitude, longitude });

    if (!response.success) {
      console.error('Error updating location:', response.error);
    }
  }, [user]);

  // Start sharing location
  const startSharing = useCallback(() => {
    if (!user) {
      toast.error('You must be logged in to share your location');
      return;
    }

    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsSharing(true);
    toast.success('Started sharing your location');

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateMyLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Failed to get your location');
        setIsSharing(false);
      },
      { enableHighAccuracy: true }
    );

    // Watch for position changes
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        updateMyLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Geolocation watch error:', error);
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
  }, [user, updateMyLocation]);

  // Stop sharing location via API
  const stopSharing = useCallback(async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (user) {
      const response = await liveLocationsApi.stopSharing();
      if (!response.success) {
        console.error('Error stopping location sharing:', response.error);
      }
    }

    setIsSharing(false);
    toast.success('Stopped sharing your location');
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Filter out current user's location
  const othersLocations = liveLocations.filter(l => l.user_id !== user?.id);
  const myLocation = liveLocations.find(l => l.user_id === user?.id);

  return {
    liveLocations,
    othersLocations,
    myLocation,
    isSharing,
    startSharing,
    stopSharing,
  };
}
