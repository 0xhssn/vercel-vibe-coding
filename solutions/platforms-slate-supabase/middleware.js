import { NextResponse } from "next/server";

// CORS Configuration
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ...(process.env.NODE_ENV === "development"
    ? [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
      ]
    : []),
].filter(Boolean);

function isOriginAllowed(origin) {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

export const config = {
  matcher: [
    "/",
    "/:path",
    "/site/:id",
    "/site/:id/:path",
    "/post/:id",
    "/post/:id/:path",
  ],
};

export default async function middleware(req) {
  const origin = req.headers.get("origin");
  const pathname = req.nextUrl.pathname;
  const url = req.nextUrl;

  // CORS handling for API routes
  if (pathname.startsWith("/api/")) {
    // Handle preflight requests
    if (req.method === "OPTIONS") {
      if (!isOriginAllowed(origin)) {
        return new NextResponse(null, { status: 403 });
      }

      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // For regular API requests, validate origin and add CORS headers
    const response = NextResponse.next();

    if (isOriginAllowed(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }

    return response;
  }

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get("host") || "demo.vercel.pub";

  // Only for demo purposes – remove this if you want to use your root domain as the landing page
  if (hostname === "vercel.pub" || hostname === "platforms.vercel.app") {
    return NextResponse.redirect("https://demo.vercel.pub");
  }

  /*  You have to replace ".vercel.pub" with your own domain if you deploy this example under your domain.
      You can also use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
      in this case, our team slug is "platformize", thus *.platformize.vercel.app works. Do note that you'll
      still need to add "*.platformize.vercel.app" as a wildcard domain on your Vercel dashboard. */

  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname
          .replace(`.vercel.pub`, "")
          .replace(`.platformize.vercel.app`, "")
      : hostname.replace(`.localhost:3000`, "");

  if (!url.pathname.includes(".") && !url.pathname.startsWith("/api")) {
    if (currentHost == "app") {
      if (
        url.pathname === "/login" &&
        (req.cookies.get("next-auth.session-token") ||
          req.cookies.get("__Secure-next-auth.session-token"))
      ) {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      url.pathname = `/app${url.pathname}`;
      return NextResponse.rewrite(url);
    }

    if (
      hostname === "localhost:3000" ||
      hostname === "platformize.vercel.app"
    ) {
      url.pathname = `/home${url.pathname}`;
      return NextResponse.rewrite(url);
    }

    url.pathname = `/_sites/${currentHost}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
}