import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname === "/"; // Login page is root
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isVoterRoute = req.nextUrl.pathname.startsWith("/vote");

    // If attempting to login but already authenticated
    if (isAuthPage && isAuth) {
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.redirect(new URL("/vote", req.url));
    }

    // Protect Admin routes
    if (isAdminRoute) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      if (token.role !== "ADMIN") {
        // Kick active voters OUT of admin pages
        return NextResponse.redirect(new URL("/vote", req.url));
      }
    }

    // Protect Voter routes
    if (isVoterRoute) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      // Note: Admins can probably view the vote page or just be blocked if we strictly want them isolated.
      // Currently, we'll allow Admins to see it or we can redirect them to Admin page.
      if (token.role === "ADMIN") {
         return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware logic handle the redirects instead of true/false authorized bools catching it and redirecting to signIn page automatically
    },
  }
);

export const config = {
  matcher: ["/", "/admin/:path*", "/vote/:path*"],
};
