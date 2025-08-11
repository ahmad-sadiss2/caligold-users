import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.caligolddrive.com/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.phone || 
        !body.pickupLocation || !body.dropoffLocation || !body.pickupDateTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Forward request to backend
    const response = await fetch(`${API_BASE_URL}/public/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        pickupLocation: body.pickupLocation,
        dropoffLocation: body.dropoffLocation,
        pickupDateTime: body.pickupDateTime,
        returnDateTime: body.returnDateTime || null,
        passengerCount: body.passengerCount || 1,
        isRoundTrip: body.isRoundTrip || false,
        specialRequests: body.specialRequests || '',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: data.message || 'Failed to submit booking' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 