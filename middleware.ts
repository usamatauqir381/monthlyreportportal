import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to enforce authentication and authorization
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/auth/login", "/auth/signup", "/auth/callback", "/"];

  // Check if route is public
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const token = request.cookies.get("sb-auth-token")?.value;

  if (!token) {
    // Redirect to login if accessing protected route without auth
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  const userRole = request.cookies.get("user-role")?.value;

  // CEO-only routes
  if (pathname.startsWith("/dashboard/ceo") && userRole !== "CEO" && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Department routes - ensure user belongs to department
  const departmentMatch = pathname.match(/\/dashboard\/(\w+)/);
  if (departmentMatch) {
    const requestedDept = departmentMatch[1];
    const userDept = request.cookies.get("user-department")?.value;

    // Allow if CEO/ADMIN or if user belongs to department
    if (
      userRole !== "CEO" &&
      userRole !== "ADMIN" &&
      userRole !== "DEPARTMENT_HEAD" &&
      userDept !== requestedDept
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Admin-only routes
  if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
