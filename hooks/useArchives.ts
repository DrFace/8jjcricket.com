'use client';

import { useState, useEffect } from 'react';
import { ArchivesResponse, ArchiveFilters } from '@/types/archive';
import { getArchives } from '@/lib/api/archives';

interface UseArchivesResult {
  data: ArchivesResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch archives with optional filters
 * @param filters - Optional filter parameters
 * @returns { data, loading, error, refetch }
 */
export function useArchives(filters?: ArchiveFilters): UseArchivesResult {
  const [data, setData] = useState<ArchivesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArchives = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getArchives(filters);
      setData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch archives';
      setError(errorMessage);
      console.error('Error in useArchives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters?.date,
    filters?.format,
    filters?.category,
    filters?.per_page,
    filters?.page,
  ]);

  return {
    data,
    loading,
    error,
    refetch: fetchArchives,
  };
}
