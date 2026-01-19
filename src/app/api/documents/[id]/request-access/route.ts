import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

async function authorizedFetch(url: string, options: RequestInit = {}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) throw new Error("Unauthorized");

    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
}

// POST /api/documents/[id]/request-access
export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const body = await request.json();
    try {
        // Backend endpoint: /v1/documents/:id/request-access
        const response = await authorizedFetch(`http://localhost:8080/v1/documents/${id}/request-access`, {
            method: "POST",
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
