import { createElysia } from "@libs/elysia";
import MinioClient from "@libs/minioClient";
import { cdnModel } from "@models/cdn.model";
import { fileTypeFromBuffer } from "file-type";

export default createElysia()
  .use(cdnModel)
  .post(
    "/download",
    async ({ body }) => {
      const stream = await MinioClient.getObject(
        Bun.env.MINIO_BUCKET_NAME!,
        body.filename
      );

      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const fileBuffer = Buffer.concat(chunks as unknown as Uint8Array[]);

      const type = await fileTypeFromBuffer(new Uint8Array(fileBuffer));
      if (!type) {
        return {
          data: null,
          message: "Unable to determine file type",
        };
      }

      const headers = {
        "Content-Type": type?.mime ?? "image/jpeg",
        "Content-Disposition": `attachment; filename="${body.filename}"`,
      };

      return new Response(fileBuffer, { headers });
    },
    {
      body: "cdn.download",
      tags: ["CDN"],
    }
  )
  .post(
    "/download/public",
    async ({ body }) => {
      const preDesignUrl = await MinioClient.presignedUrl(
        "GET",
        Bun.env.MINIO_BUCKET_NAME!,
        body.filename
      );

      return {
        data: preDesignUrl,
        message: "success",
      };
    },
    {
      body: "cdn.download",
      tags: ["CDN"],
    }
  );
