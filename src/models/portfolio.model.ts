import Elysia, { t } from "elysia";

const portfolioModel = new Elysia().model({
  "portfolio.model": t.Object({
    img: t.String({ format: "uri" }),
    title: t.String(),
    description: t.Optional(t.String()),
    content: t.Optional(t.String()),
    href: t.Optional(t.String()),
    projectLink: t.Optional(t.String({ format: "uri" })),
    isFeatured: t.Boolean(),
    stacks: t.Array(t.String()),
    createdAt: t.Optional(t.Date()),
  }),
});

export default portfolioModel;
