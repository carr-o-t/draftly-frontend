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

// DELETE /api/documents/[id]/share/[userId]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; userId: string }> }
) {
  const { id, userId } = await context.params;
  try {
    // Backend endpoint: /v1/documents/:id/share/:userId
    const response = await authorizedFetch(
      `http://localhost:8080/v1/documents/${id}/share/${userId}`,
      {
        method: 'DELETE',
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
