import Elysia, { t } from "elysia";

const aiModel = new Elysia().model({
  "ai.req.model": t.Object({
    msg: t.String(),
    aiChatId: t.Optional(t.String()),
  }),
});

export default aiModel;
