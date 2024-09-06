import { BadRequestException } from "@constants/exceptions";
import { createElysia } from "@libs/elysia";
import { lucia } from "@libs/luciaAuth";

const logout = createElysia().post("/logout", async ({ cookie, log }) => {
  const sessionCookie = cookie[lucia.sessionCookieName];

  if (!sessionCookie?.value) {
    throw new BadRequestException("Session not found");
  }
  // await lucia.invalidateSession(sessionCookie.value);
  const blankSessionCookie = lucia.createBlankSessionCookie();

  sessionCookie.set({
    value: blankSessionCookie.value,
    ...blankSessionCookie.attributes,
  });
});

export { logout };
