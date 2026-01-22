import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Archives API Route
 * Fetches archive data from backend with team logos
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const filters = {
      date: searchParams.get('date') || '',
      format: searchParams.get('format') || '',
      category: searchParams.get('category') || '',
    };
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '30');

    // Build query parameters for backend
    const params = new URLSearchParams();
    if (filters.date) params.append('date', filters.date);
    if (filters.format) params.append('format', filters.format);
    if (filters.category) params.append('category', filters.category);
    params.append('per_page', String(perPage));
    params.append('page', String(page));

    const queryString = params.toString();
    
    // Use production backend
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://8jjcricket.com'}/api/archives${queryString ? `?${queryString}` : ''}`;

    console.log('Fetching archives from backend:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('❌ Backend error:', response.status, text);
      return NextResponse.json(
        { error: 'Failed to fetch archives', status: response.status, details: text },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Successfully fetched archives:', data.data?.length || 0, 'matches');
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Error fetching archives:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}