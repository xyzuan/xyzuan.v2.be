import Elysia, { t } from "elysia";

const workModel = new Elysia().model({
  "work.model": t.Object({
    logo: t.String({ format: "uri" }),
    jobTitle: t.String(),
    responsibilities: t.Array(t.String()),
    address: t.String(),
    instance: t.String(),
    instanceLink: t.String({ format: "uri" }),
    date: t.String(),
  }),
  "work.model.response": t.Object({
    id: t.Number(),
    logo: t.String({ format: "uri" }),
    jobTitle: t.String(),
    instance: t.String(),
    instanceLink: t.String({ format: "uri" }),
    address: t.String(),
    date: t.String(),
  }),
});

export default workModel;
