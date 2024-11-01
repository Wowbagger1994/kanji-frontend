import type { NextRequest, NextResponse } from "next/server";

export { auth as middleware } from "@/auth";

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
