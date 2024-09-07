import { Params } from '@/types/routesTypes';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Params }) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const encodedUrl = params.params[0];
  const encodedBody = params.params[1] || null;
  const decodedUrl = Buffer.from(encodedUrl, 'base64').toString('utf-8');
  const body = encodedBody
    ? Buffer.from(encodedBody, 'base64').toString('utf-8')
    : null;
  const headers: Record<string, string> = Object.fromEntries(
    new URLSearchParams(request.url.split('?')[1]),
  );

  try {
    const response = await fetch(decodedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 },
    );
  }
}
