import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const jwtToken = req.cookies.get("jwt_token");
  const token = jwtToken?.value;

  const origin = req.headers.get("origin");
  const response = NextResponse.next();

  if (origin === "http://localhost:3000") {
    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3000",
    );
  } else if (origin === "https://learn-next-js-pied-eight.vercel.app") {
    response.headers.set(
      "Access-Control-Allow-Origin",
      "https://learn-next-js-pied-eight.vercel.app",
    );
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: response.headers });
  }

  if (req.nextUrl.pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    token &&
    (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname === "/profile" && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    !token &&
    req.method !== "GET" &&
    !["/api/users/login", "/api/users/register"].includes(req.nextUrl.pathname)
  ) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/profile",
    "/login",
    "/register",
  ],
};
