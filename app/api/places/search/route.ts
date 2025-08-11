import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query || query.length < 2) {
      return NextResponse.json([], { status: 400 });
    }

    // Build the OpenStreetMap Nominatim API URL
    const nominatimUrl = new URL('https://nominatim.openstreetmap.org/search');
    nominatimUrl.searchParams.set('format', 'json');
    nominatimUrl.searchParams.set('q', query);
    nominatimUrl.searchParams.set('countrycodes', searchParams.get('countrycodes') || 'us');
    nominatimUrl.searchParams.set('limit', searchParams.get('limit') || '8');
    nominatimUrl.searchParams.set('addressdetails', searchParams.get('addressdetails') || '1');
    nominatimUrl.searchParams.set('extratags', searchParams.get('extratags') || '1');
    nominatimUrl.searchParams.set('namedetails', searchParams.get('namedetails') || '1');

    // Make request to OpenStreetMap
    const response = await fetch(nominatimUrl.toString(), {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'CALI-GOLD-DRIVE/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`OpenStreetMap API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Return the data with proper CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
