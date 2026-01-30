import { useState, useEffect, useCallback } from 'react';
import { locationsApi } from '@/services/api/locationsApi';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { Location } from '@/services/types';

export type { Location } from '@/services/types';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    
    const response = await locationsApi.getAll();

    if (!response.success) {
      console.error('Error fetching locations:', response.error);
      toast.error('Failed to load locations');
      setLocations([]);
    } else {
      setLocations(response.data || []);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations, user, isAdmin]);

  const addLocation = useCallback(async (
    name: string,
    latitude: number,
    longitude: number,
    description?: string
  ) => {
    if (!user) {
      toast.error('You must be logged in to add locations');
      return { error: new Error('Not authenticated') };
    }

    const response = await locationsApi.create({
      name,
      latitude,
      longitude,
      description,
    });

    if (!response.success) {
      toast.error(response.error || 'Failed to add location');
      return { error: new Error(response.error) };
    }

    toast.success(response.message || 'Location submitted for approval');
    await fetchLocations();
    return { data: response.data };
  }, [user, fetchLocations]);

  const updateLocationStatus = useCallback(async (
    id: string,
    status: 'approved' | 'denied'
  ) => {
    if (!isAdmin) {
      toast.error('Only admins can approve locations');
      return { error: new Error('Not authorized') };
    }

    const response = await locationsApi.updateStatus({ id, status });

    if (!response.success) {
      toast.error(response.error || 'Failed to update location status');
      return { error: new Error(response.error) };
    }

    toast.success(response.message || `Location ${status}`);
    await fetchLocations();
    return { error: null };
  }, [isAdmin, fetchLocations]);

  const deleteLocation = useCallback(async (id: string) => {
    if (!isAdmin) {
      toast.error('Only admins can delete locations');
      return { error: new Error('Not authorized') };
    }

    const response = await locationsApi.delete({ id });

    if (!response.success) {
      toast.error(response.error || 'Failed to delete location');
      return { error: new Error(response.error) };
    }

    toast.success('Location deleted');
    await fetchLocations();
    return { error: null };
  }, [isAdmin, fetchLocations]);

  // Filter locations for display
  const approvedLocations = locations.filter(l => l.status === 'approved');
  const pendingLocations = locations.filter(l => l.status === 'pending');
  const userLocations = locations.filter(l => l.created_by === user?.id);

  return {
    locations,
    approvedLocations,
    pendingLocations,
    userLocations,
    isLoading,
    addLocation,
    updateLocationStatus,
    deleteLocation,
    refetch: fetchLocations,
  };
}
