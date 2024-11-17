import { BadRequestException } from "@constants/exceptions";
import { createElysia } from "@libs/elysia";
import { lucia } from "@libs/luciaAuth";
import { prismaClient } from "@libs/prismaDatabase";
import { password as bunPassword } from "bun";
import authModel from "@models/auth.model";

export default createElysia()
  .use(authModel)
  .post(
    "/login",
    async ({
      body: { email, password },
      cookie,
      set,
      logestic,
      env: { DOMAIN, PASSWORD_PEPPER },
    }) => {
      const user = await prismaClient.user.findUnique({
        where: {
          email,
        },
      });

      if (!user || !user.passwordSalt || !user.hashedPassword) {
        logestic.error("User not found.");
        throw new BadRequestException("User not found.");
      }

      const passwordPepper = PASSWORD_PEPPER;

      if (!passwordPepper) {
        logestic.error("Password pepper is not set.");
        throw new Error("Password pepper is not set.");
      }

      if (!user || !user.passwordSalt || !user.hashedPassword) {
        logestic.error("User data is missing or incomplete.");
      } else if (
        !(await bunPassword.verify(
          user.passwordSalt + password + passwordPepper,
          user.hashedPassword
        ))
      ) {
        logestic.error("Password is invalid.");
        throw new BadRequestException("Password is invalid.");
      } else {
        try {
          const session = await lucia.createSession(user.id, {});
          const sessionCookie = lucia.createSessionCookie(session.id);

          set.status = 200;
          cookie[sessionCookie.name]?.set({
            value: sessionCookie.value,
            domain: DOMAIN,
            ...sessionCookie.attributes,
          });

          return user;
        } catch (error) {
          set.status = 500;
        }
      }
    },
    {
      detail: {
        tags: ["Authorization Service"],
      },
      body: "auth.login",
    }
  );
