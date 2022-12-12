import { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // const token = req.cookies.get("gtd-token")
  // if (req.nextUrl.pathname.startsWith("/login")) {
  //   if (token?.value === undefined || token.value === "undefined") {
  //     req.cookies.delete("gtd-token")
  //   }
  //   return NextResponse.next()
  // }
  // if (req.nextUrl.pathname.startsWith("/_next")) {
  //   return NextResponse.next()
  // }
  // if (!req.nextUrl.pathname.startsWith("/login")) {
  //   if (token?.value === undefined || token.value === "undefined") {
  //     req.cookies.delete("gtd-token")
  //     return NextResponse.redirect(new URL("/login", req.url))
  //   }
  //   try {
  //     await verify(token.value, "at-secret")
  //     return NextResponse.next()
  //   } catch (error) {
  //     return NextResponse.redirect(new URL("/login", req.url))
  //   }
  // }
}
