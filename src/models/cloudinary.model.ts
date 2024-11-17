import Elysia, { t } from "elysia";

const cloudinaryModel = new Elysia().model({
  "cloudinary.model": t.Object({
    image: t.String(),
  }),
});

export default cloudinaryModel;
