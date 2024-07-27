import { lucia } from "@/auth/lucia";
import { cookies } from "next/headers";
import { OAuth2RequestError, type GoogleRefreshedTokens } from "arctic";

import { google } from "@/auth/oauth";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { generateId } from "lucia";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier =
    cookies().get("google_oauth_code_verifier")?.value ?? null;
  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier
    );
    let googleRefreshToken: GoogleRefreshedTokens | undefined = undefined;

    if (tokens.refreshToken) {
      googleRefreshToken = await google.refreshAccessToken(tokens.refreshToken);
    }

    const googleUserResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    const googleUser = (await googleUserResponse.json()) as GoogleUserInfo;
    const existingUser = await db.query.userTable.findFirst({
      where: (userTable, { eq }) => eq(userTable.googleId, googleUser.email),
    });

    if (existingUser) {
      const session = await lucia.createSession(String(existingUser.id), {
        created_at: new Date(),
        updated_at: new Date(),
      });
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    } else {
      const newUser = await db.insert(userTable).values({
        id: generateId(9),
        googleId: googleUser.email,
        username: googleUser.name,
        profileImage: googleUser.picture,
      });

      const session = await lucia.createSession(
        String(newUser.lastInsertRowid),
        {
          created_at: new Date(),
          updated_at: new Date(),
        }
      );
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    console.error("Error exchanging code for token", error);

    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
        statusText: "Bad Request",
      });
    }

    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}

interface GoogleUserInfo {
  email: string;
  picture: string;
  name: string;
}
