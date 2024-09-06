import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";

const me = createElysia()
  .use(authGuard)
  .get("/", ({ user }) => {
    return user;
  });

export { me };
