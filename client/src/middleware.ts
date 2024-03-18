import { withAuth } from "next-auth/middleware"
import { notFound } from "next/navigation"
import { NextResponse } from "next/server"



export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname
    const user: any = req.nextauth.token
    console.log(user)

    if (user && path === "/login") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  },
  {
    callbacks: {

    },
  }

)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|api/auth|login|register).*)',
  ],
}