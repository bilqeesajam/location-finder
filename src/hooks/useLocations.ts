import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Location {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  status: 'pending' | 'approved' | 'denied';
  created_by: string | null;
  created_at: string;
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    
    let query = supabase
      .from('locations')
      .select('*')
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load locations');
    } else {
      setLocations(data as Location[]);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations, user, isAdmin]);

  const addLocation = async (
    name: string,
    latitude: number,
    longitude: number,
    description?: string
  ) => {
    if (!user) {
      toast.error('You must be logged in to add locations');
      return { error: new Error('Not authenticated') };
    }

    const { data, error } = await supabase
      .from('locations')
      .insert({
        name,
        description,
        latitude,
        longitude,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add location');
      return { error };
    }

    toast.success('Location submitted for approval');
    await fetchLocations();
    return { data };
  };

  const updateLocationStatus = async (
    id: string,
    status: 'approved' | 'denied'
  ) => {
    if (!isAdmin) {
      toast.error('Only admins can approve locations');
      return { error: new Error('Not authorized') };
    }

    const { error } = await supabase
      .from('locations')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update location status');
      return { error };
    }

    toast.success(`Location ${status}`);
    await fetchLocations();
    return { error: null };
  };

  const deleteLocation = async (id: string) => {
    if (!isAdmin) {
      toast.error('Only admins can delete locations');
      return { error: new Error('Not authorized') };
    }

    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete location');
      return { error };
    }

    toast.success('Location deleted');
    await fetchLocations();
    return { error: null };
  };

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
