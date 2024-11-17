import Elysia, { t } from "elysia";

const userModel = new Elysia().model({
  "user.model": t.Object({
    name: t.Optional(t.String()),
    about: t.Optional(t.String()),
    iconUrl: t.Optional(t.String()),
    bannerUrl: t.Optional(t.String()),
    headline: t.Optional(t.String()),
    location: t.Optional(t.String()),
  }),
});

export default userModel;
