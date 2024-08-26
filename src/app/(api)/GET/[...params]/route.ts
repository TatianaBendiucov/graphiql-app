import { Params } from '@/types/routesTypes';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Params }) {
  const encodedUrl = params.params[0];
  const decodedUrl = Buffer.from(encodedUrl, 'base64').toString('utf-8');

  const headers: Record<string, string> = Object.fromEntries(
    new URLSearchParams(request.url.split('?')[1]),
  );

  try {
    const response = await fetch(decodedUrl, { method: 'GET', headers });
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
