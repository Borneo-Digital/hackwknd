import { NextRequest, NextResponse } from 'next/server';

type RouteParams = {
  params: {
    path: string[];
  };
};

/**
 * API route that acts as a proxy to the Strapi backend
 * This avoids CORS issues by proxying requests from the same origin
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    if (!strapiUrl) {
      console.error('NEXT_PUBLIC_STRAPI_API_URL is not defined');
      return NextResponse.json(
        { error: 'API URL not configured' },
        { status: 500 }
      );
    }
    
    const path = context.params.path.join('/');
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
  context: RouteParams
) {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    if (!strapiUrl) {
      console.error('NEXT_PUBLIC_STRAPI_API_URL is not defined');
      return NextResponse.json(
        { error: 'API URL not configured' },
        { status: 500 }
      );
    }
    
    const path = context.params.path.join('/');
    const body = await request.json();
    
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