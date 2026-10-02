import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { query, page = 1 } = await request.json();
    
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: query,
        gl: 'us',
        num: 50,
        page: page
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}