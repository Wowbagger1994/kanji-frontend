import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const hasToken = request.cookies.has("refreshToken");
	//TODO: uncomment
	// if (
	// 	!hasToken &&
	// 	!request.nextUrl.pathname.startsWith("/login") &&
	// 	!request.nextUrl.pathname.startsWith("/register")
	// ) {
	// 	return Response.redirect(new URL("/login", request.url));
	// }

	// if (hasToken && !request.nextUrl.pathname.startsWith("/kanji")) {
	// 	return Response.redirect(new URL("/kanji", request.url));
	// }
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
