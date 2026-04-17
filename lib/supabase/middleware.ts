import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { STUDENT_SESSION_COOKIE_NAME, verifyStudentSessionToken } from "@/lib/student-session";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { Database } from "@/types/supabase";

const publicPaths = ["/", "/login"];

function isPublicPath(pathname: string) {
  return publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isStudentPortalPath(pathname: string) {
  return pathname === "/student";
}

function isStudentLoginPath(pathname: string) {
  return pathname === "/student/login";
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublicRoute = isPublicPath(pathname);
  const isStudentPortalRoute = isStudentPortalPath(pathname);
  const isStudentLoginRoute = isStudentLoginPath(pathname);
  let response = NextResponse.next({
    request,
  });

  if (isStudentPortalRoute || isStudentLoginRoute) {
    const studentSessionToken = request.cookies.get(STUDENT_SESSION_COOKIE_NAME)?.value;
    const studentSession = await verifyStudentSessionToken(
      studentSessionToken,
    );

    if (!studentSession && studentSessionToken) {
      response.cookies.delete(STUDENT_SESSION_COOKIE_NAME);
    }

    if (!studentSession && isStudentPortalRoute) {
      return NextResponse.redirect(new URL("/student/login", request.url));
    }

    return response;
  }

  try {
    const { url, anonKey } = getSupabasePublicConfig();
    const supabase = createServerClient<Database>(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });
    const { data, error } = await supabase.auth.getClaims();
    const claims = data?.claims;

    const isAuthenticated = Boolean(claims?.sub) && !error;

    if (!isAuthenticated && !isPublicRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  } catch {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return response;
  }
}
