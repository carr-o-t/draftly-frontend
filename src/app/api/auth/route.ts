import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // TODO: Add backend URL to env vars
        const response = await fetch("http://localhost:8080/v1/auth/login-or-register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        // Extract token and set cookie
        // Backend response: { success: true, data: { token: "...", user: ... } }
        const token = data?.data?.token;
        const userEmail = data?.data?.user?.email;

        const cookieStore = await cookies();

        if (token) {
            cookieStore.set({
                name: "auth_token",
                value: token,
                httpOnly: true,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7, // 1 week
                sameSite: "lax",
            });

            // client-readable copy so the browser can pass it to the ws connection
            cookieStore.set({
                name: "ws_token",
                value: token,
                httpOnly: false,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "lax",
            });
        }

        if (userEmail) {
            cookieStore.set({
                name: "user_email",
                value: userEmail,
                httpOnly: false, // Accessible to client-side JS for display
                path: "/",
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "lax",
            });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Auth Proxy Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
