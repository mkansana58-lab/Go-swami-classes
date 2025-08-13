import { getModules } from "@/lib/admin-content-service";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// This endpoint is now for admin-created modules
export async function GET() {
    try {
        const content = await getModules();
        return NextResponse.json(content);
    } catch (error) {
        // If file doesn't exist, it will be handled by getModules
        console.error("Failed to read admin content:", error);
        return new NextResponse(
            JSON.stringify({ message: "Failed to read admin content" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
