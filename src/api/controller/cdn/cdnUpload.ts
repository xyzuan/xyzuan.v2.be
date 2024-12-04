import ShortUniqueId from "short-unique-id";

import MinioClient from "@libs/minioClient";
import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { cdnModel } from "@models/cdn.model";
import { isMetaDataImg } from "@utils/cdnUtils";

export default createElysia()
  .use(cdnModel)
  .use(authGuard)
  .post(
    "/upload",
    async ({ body }) => {
      try {
        const fileBuffer = await body.file.arrayBuffer();
        const { randomUUID } = new ShortUniqueId({ length: 20 });

        if (!(await isMetaDataImg(fileBuffer))) {
          return {
            data: null,
            message: "Uploaded file is not a valid image",
          };
        }

        const fileName = `${randomUUID()}.png`;
        const metadata = {
          "Content-Type": body.file.type,
          "Content-Length": body.file.size.toString(),
        };

        await MinioClient.putObject(
          Bun.env.MINIO_BUCKET_NAME!,
          fileName,
          Buffer.from(fileBuffer),
          body.file.size,
          metadata
        );

        return {
          data: `File uploaded successfully to ${Bun.env.MINIO_BUCKET_NAME}/${fileName}`,
          message: "success",
        };
      } catch (error) {
        return {
          data: "There is something wrong",
          message: error,
        };
      }
    },
    {
      body: "cdn.upload",
      type: "multipart/form-data",
      tags: ["CDN"],
    }
  );
