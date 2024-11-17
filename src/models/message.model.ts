import Elysia, { t } from "elysia";

const messageModel = new Elysia().model({
  "message.model": t.Object({
    action: t.Enum({
      CREATE: "CREATE",
      DELETE: "DELETE",
    }),
    message: t.String(),
    messageId: t.Optional(t.String()),
    messageMentionId: t.Optional(t.String()),
  }),
});

export default messageModel;
