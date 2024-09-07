import { createElysia } from "@libs/elysia";
import { genAuthUrl } from "@utils/authUtils";
import { generateCodeVerifier, generateState } from "arctic";
import { t } from "elysia";

const provider = createElysia().get(
  "/:provider",
  async ({
    params: { provider },
    cookie: { oauth_state, oauth_code_verifier, oauth_next },
    set,
    query: { next },
    env: { NODE_ENV },
  }) => {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const redirectUrl = await genAuthUrl(provider, state, codeVerifier);

    oauth_state?.set({
      value: state,
      path: "/",
      secure: NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 10,
    });

    oauth_code_verifier?.set({
      value: codeVerifier,
      path: "/",
      secure: NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 10,
    });

    oauth_next?.set({
      value: next ?? "/",
      path: "/",
      secure: NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 10,
    });

    set.redirect = redirectUrl.toString();
  },
  {
    query: t.Object({
      next: t.Optional(t.String()),
    }),
    params: t.Object({
      provider: t.Union([t.Literal("google")]),
    }),
  }
);

export { provider };
