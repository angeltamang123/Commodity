import { NextResponse } from "next/server";
import * as jose from "jose";

const adminRoutes = ["/admin", "/admin/:path*"];

const userRoutes = [
  "/wishlist",
  "/notifications",
  "/settings",
  "/settings/:path*",
  "/orders",
  "/chatbot",
];

export default async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Redirection for users not logged in
  if (userRoutes.some((path) => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin routes
  if (adminRoutes.some((path) => pathname.startsWith(path))) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      // jwt from jsonwebtoken doesn't work in middleware so jose is required
      const { payload } = await jose.jwtVerify(token, secret);
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/404", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/404", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/wishlist/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/orders/:path*",
    "/chatbot/:path*",
    "/admin/:path*",
  ],
};
