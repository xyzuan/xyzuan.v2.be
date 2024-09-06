import { createElysia } from "@libs/elysia";
import { login } from "./login";
import { signup } from "./signup";
import { logout } from "./logout";

const auth = createElysia().use(login).use(signup).use(logout);

export { auth };
