import { NextRequest, NextResponse } from "next/server";

// Password-protects the admin pages with HTTP Basic Auth.
// Set ADMIN_USER and ADMIN_PASSWORD in Vercel → Settings → Environment Variables.
export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;
  if (!user || !pass) return new NextResponse("Admin not configured", { status: 503 });

  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(header.slice(6));
    } catch {
      // Malformed base64: fall through to 401.
    }
    const [u, ...rest] = decoded.split(":");
    if (decoded && u === user && rest.join(":") === pass) return NextResponse.next();
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Applications"' },
  });
}

export const config = { matcher: ["/admin/:path*", "/api/export"] };
