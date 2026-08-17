import Elysia, { t } from "elysia";

const collectionModel = new Elysia().model({
  "collection.model": t.Object({
    image: t.String({ format: "uri" }),
    title: t.String(),
    affiliateLink: t.String({ format: "uri" }),
    storeName: t.Enum({
      SHOPEE: "SHOPEE",
      TOKOPEDIA: "TOKOPEDIA",
    }),
    category: t.Enum({
      GADGETS: "GADGETS",
      BOOKS: "BOOKS",
      TOOLS: "TOOLS",
      WORKSPACE: "WORKSPACE",
      SOFTWARE: "SOFTWARE",
    }),
    isFeatured: t.Boolean(),
  }),
});

export default collectionModel;
