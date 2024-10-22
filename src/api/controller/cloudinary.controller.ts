import { t } from "elysia";

import { authGuard } from "@libs/authGuard";
import { cloudinary } from "@libs/cloudinary";
import { createElysia } from "@libs/elysia";

export const CloudinaryController = createElysia()
  .use(authGuard)
  .post(
    "/upload",
    async ({ body }) => {
      const secureUrl = await cloudinary.uploader.upload(body.image, {
        transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
      });
      return {
        status: "200",
        data: {
          secureUrl,
        },
      };
    },
    {
      body: t.Object({
        image: t.String(),
      }),
      tags: ["Assets", "Cloudinary"],
    }
  );
