import { ArchivesResponse, ArchiveFilters } from '@/types/archive';

// Use Next.js API routes (relative path for client-side fetch)
const API_BASE_URL = '/api';

/**
 * Build query string from filter parameters
 */
function buildQueryString(filters?: ArchiveFilters): string {
  if (!filters) return '';

  const params = new URLSearchParams();

  if (filters.date) params.append('date', filters.date);
  if (filters.format) params.append('format', filters.format);
  if (filters.category) params.append('category', filters.category);
  if (filters.per_page) params.append('per_page', filters.per_page.toString());
  if (filters.page) params.append('page', filters.page.toString());

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Fetch archives with optional filters
 * @param filters - Optional filter parameters
 * @returns Promise<ArchivesResponse>
 * @throws Error if the request fails
 */
export async function getArchives(filters?: ArchiveFilters): Promise<ArchivesResponse> {
  try {
    const queryString = buildQueryString(filters);
    const url = `${API_BASE_URL}/archives${queryString}`;

    console.log('Fetching archives from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store', // Disable caching for dynamic data
    });

    console.log('Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch archives: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const data: ArchivesResponse = await response.json();
    console.log('Archives data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching archives:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the API. Please check if the backend server is running.');
    }
    throw error;
  }
}

/**
 * Get a single archive by ID (if needed in the future)
 * @param id - Archive ID
 */
export async function getArchiveById(id: number): Promise<any> {
  try {
    const url = `${API_BASE_URL}/archives/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch archive: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching archive:', error);
    throw error;
  }
}
