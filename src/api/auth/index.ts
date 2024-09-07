import { createElysia } from "@libs/elysia";
import { login } from "./login";
import { signup } from "./signup";
import { logout } from "./logout";
import { provider } from "./provider";
import { providerCallback } from "./providerCallback";

const auth = createElysia()
  .use(provider)
  .use(providerCallback)
  .use(login)
  .use(signup)
  .use(logout);

export { auth };
