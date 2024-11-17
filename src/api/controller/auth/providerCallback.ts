import {
  BadRequestException,
  InternalServerErrorException,
} from "@constants/exceptions";
import { createElysia } from "@libs/elysia";
import { lucia } from "@libs/luciaAuth";
import { prismaClient } from "@libs/prismaDatabase";
import { getAuthAccount, getTokens } from "@utils/authUtils";
import { OAuth2RequestError } from "arctic";
import { t } from "elysia";
import { generateId } from "lucia";

export default createElysia().get(
  "/:provider/callback",
  async ({
    query: { code, state },
    cookie,
    params: { provider },
    set,
    env: { DOMAIN },
    log,
  }) => {
    const { oauth_state, oauth_code_verifier, oauth_next } = cookie;
    const next = oauth_next?.value ?? "/";
    const storedState = oauth_state?.value;
    const storedCodeVerifier = oauth_code_verifier?.value;

    if (!storedState || !storedCodeVerifier || state !== storedState) {
      throw new BadRequestException(
        "The state provided does not match the state in the cookie."
      );
    }

    try {
      const userId = generateId(15);
      const tokens = await getTokens(provider, code, storedCodeVerifier);
      const account = await getAuthAccount(provider, tokens.accessToken());

      const existingUser = await prismaClient.user.findUnique({
        where: {
          email: account.email,
        },
      });

      const existingOAuthAccount = await prismaClient.oAuthAccount.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId: account.id,
          },
        },
      });

      if (!existingUser) {
        await prismaClient.user
          .create({
            data: {
              id: userId,
              name: account.username,
              email: account.email,
              iconUrl: account.iconUrl,
            },
          })
          .catch((error) => {
            log.error(error);
            throw new InternalServerErrorException();
          });
      }

      if (!existingOAuthAccount) {
        await prismaClient.oAuthAccount
          .create({
            data: {
              provider: provider,
              providerAccountId: account.id,
              userId: existingUser === null ? userId : existingUser.id,
            },
          })
          .catch((error) => {
            log.error(error);
            throw new InternalServerErrorException();
          });
      }

      const session = await lucia.createSession(
        existingUser === null ? userId : existingUser.id,
        {}
      );
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookie[sessionCookie.name]?.set({
        domain: DOMAIN,
        value: sessionCookie.value,
        ...sessionCookie.attributes,
      });
      set.redirect = next;
    } catch (error) {
      log.error(error);
      if (error instanceof OAuth2RequestError) {
        throw new BadRequestException();
      }
      throw new InternalServerErrorException();
    }
  },
  {
    detail: {
      tags: ["Authorization Service"],
    },
    query: t.Object(
      {
        code: t.String(),
        state: t.String(),
      },
      { additionalProperties: true }
    ),
    params: t.Object({
      provider: t.Union([
        t.Literal("google"),
        t.Literal("github"),
        t.Literal("linkedin"),
      ]),
    }),
  }
);
