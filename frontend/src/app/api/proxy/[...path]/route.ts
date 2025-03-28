import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    path: string[];
  };
}

/**
 * API route that acts as a proxy to the Strapi backend
 * This avoids CORS issues by proxying requests from the same origin
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Fallback to a default URL if environment variable is missing
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://api.hackwknd.sarawak.digital';
    
    const path = params.path.join('/');
    const url = new URL(request.url);
    const queryString = url.search;
    
    console.log(`Proxying request to: ${strapiUrl}/api/${path}${queryString}`);
    
    const response = await fetch(`${strapiUrl}/api/${path}${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      return NextResponse.json(
        { error: 'Invalid response from API server' },
        { status: 502 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Error fetching data from Strapi' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Fallback to a default URL if environment variable is missing
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://api.hackwknd.sarawak.digital';
    
    const path = params.path.join('/');
    let body;
    
    try {
      body = await request.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    console.log(`Proxying POST request to: ${strapiUrl}/api/${path}`);
    
    const response = await fetch(`${strapiUrl}/api/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      return NextResponse.json(
        { error: 'Invalid response from API server' },
        { status: 502 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Error sending data to Strapi' },
      { status: 500 }
    );
  }
}