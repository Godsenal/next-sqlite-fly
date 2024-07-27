import { generateCodeVerifier, generateState } from "arctic";
import { google } from "@/auth/oauth";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const redirectUri = request.nextUrl.searchParams.get("redirect_uri") ?? "/";
  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["email", "profile"],
  });

  cookies().set("google_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  cookies().set("google_oauth_code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  cookies().set("google_oauth_redirect_uri", redirectUri, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
