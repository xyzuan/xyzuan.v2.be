import { BadRequestException } from "@constants/exceptions";
import { createElysia } from "@libs/elysia";
import { lucia } from "@libs/luciaAuth";
import { prismaClient } from "@libs/prismaDatabase";
import { password as bunPassword } from "bun";
import { t } from "elysia";

const login = createElysia().post(
  "/login",
  async ({
    body: { email, password },
    cookie,
    set,
    log,
    env: { PASSWORD_PEPPER },
  }) => {
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user.passwordSalt || !user.hashedPassword) {
      log.error("User not found.");
      throw new BadRequestException("User not found.");
    }

    const passwordPepper = PASSWORD_PEPPER;

    if (!passwordPepper) {
      log.error("Password pepper is not set.");
      throw new Error("Password pepper is not set.");
    }

    if (!user || !user.passwordSalt || !user.hashedPassword) {
      log.error("User data is missing or incomplete.");
    } else if (
      !(await bunPassword.verify(
        user.passwordSalt + password + passwordPepper,
        user.hashedPassword
      ))
    ) {
      log.error("Password is invalid.");
      throw new BadRequestException("Password is invalid.");
    } else {
      try {
        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        set.status = 200;
        cookie[sessionCookie.name]?.set({
          value: sessionCookie.value,
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
    body: t.Object({
      email: t.String({
        format: "email",
      }),
      password: t.String(),
    }),
  }
);

export { login };
