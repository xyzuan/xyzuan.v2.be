import { authGuard } from "@libs/authGuard";
import { cloudinary } from "@libs/cloudinary";
import { createElysia } from "@libs/elysia";
import cloudinaryModel from "@models/cloudinary.model";

export default createElysia()
  .use(cloudinaryModel)
  .use(authGuard)
  .post(
    "/upload",
    async ({ body }) => {
      const secureUrl = await cloudinary.uploader.upload(body.image, {
        transformation: [{ fetch_format: "auto" }],
      });
      return {
        status: "200",
        data: {
          secureUrl,
        },
      };
    },
    {
      body: "cloudinary.model",
      tags: ["Assets", "Cloudinary"],
    }
  );
