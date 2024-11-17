import Elysia, { t } from "elysia";

const blogModel = new Elysia().model({
  "blog.model": t.Object({
    img: t.String(),
    title: t.String(),
    slug: t.String(),
    description: t.String(),
    content: t.String(),
    tags: t.Optional(t.String()),
    createdAt: t.Optional(t.Date()),
  }),
  "blog.comment": t.Object({
    content: t.String(),
  }),
  "blog.reaction": t.Object({
    type: t.Enum({
      LIKE: "LIKE",
      LOVE: "LOVE",
      DISLIKE: "DISLIKE",
      WOW: "WOW",
      SAD: "SAD",
      ANGRY: "ANGRY",
    }),
  }),
});

export default blogModel;