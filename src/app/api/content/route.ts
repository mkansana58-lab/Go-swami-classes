import { getModules } from "@/lib/content-service";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const content = await getModules();
        return NextResponse.json(content);
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to read content" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
