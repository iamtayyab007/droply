import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

export default clerkMiddleware(
  async (auth, req) => {
    const { userId } = await auth();

    if (userId && isPublicRoute(req)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (!isPublicRoute(req)) {
      await auth.protect();
    } else {
    }
  }

  // {
  //   signInUrl: "/sign-in", // 👈 Your custom sign-in page
  // }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
