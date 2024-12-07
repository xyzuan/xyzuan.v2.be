import Elysia, { t } from "elysia";

const blogModel = new Elysia().model({
  "blog.model": t.Object({
    img: t.String({
      format: "uri",
    }),
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
  "blog.patch.model": t.Object({
    img: t.Optional(
      t.String({
        format: "uri",
      })
    ),
    title: t.Optional(t.String()),
    slug: t.Optional(t.String()),
    description: t.Optional(t.String()),
    content: t.Optional(t.String()),
    tags: t.Optional(t.String()),
    createdAt: t.Optional(t.Date()),
  }),
});

export default blogModel;
