import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function authorizedFetch(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) throw new Error('Unauthorized');

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

// PATCH /api/documents/[id]/autosave
// Persists the derived HTML snapshot of the Yjs document (used for thumbnails).
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const response = await authorizedFetch(
      `http://localhost:8080/v1/documents/${id}/autosave`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
