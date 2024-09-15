import { Params } from '@/types/routesTypes';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Params }) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [endpointEncoded, bodyEncoded] = params.params;

  if (!endpointEncoded) {
    return NextResponse.json(
      {
        error: 'Invalid URL format. Provide both endpoint and body in the URL.',
      },
      { status: 400 },
    );
  }

  try {
    const endpoint = Buffer.from(endpointEncoded, 'base64').toString('utf-8');
    const body = Buffer.from(bodyEncoded, 'base64').toString('utf-8');

    const url = new URL(req.url);
    const headers: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      headers[key] = value;
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body,
    });

    const jsonResponse = await response.json();
    return NextResponse.json(jsonResponse, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
