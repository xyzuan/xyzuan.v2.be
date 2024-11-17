import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";

export default createElysia()
  .use(authGuard)
  .get(
    "/",
    ({ user }) => {
      return user;
    },
    {
      detail: {
        tags: ["Users"],
      },
    }
  );
