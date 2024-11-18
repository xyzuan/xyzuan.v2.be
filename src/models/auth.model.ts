import Elysia, { t } from "elysia";

const authModel = new Elysia().model({
  "auth.login": t.Object({
    email: t.String({
      format: "email",
    }),
    password: t.String(),
  }),
  "auth.signup": t.Object({
    email: t.String({
      format: "email",
    }),
    password: t.String({
      minLength: 8,
      maxLength: 64,
    }),
    name: t.String({
      minLength: 3,
      maxLength: 32,
    }),
  }),
});

export default authModel;
