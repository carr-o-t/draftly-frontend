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

// GET /api/documents/requests (List Requests)
export async function GET(request: NextRequest) {
    try {
        // Backend endpoint: /v1/documents/access/requests (Notice hierarchy change in backend vs frontend proxy)
        // User requested "apis ... under documents".
        const response = await authorizedFetch(`http://localhost:8080/v1/access/requests`);
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        if (error.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
