import { createElysia } from "@libs/elysia";
import { cdnModel } from "@models/cdn.model";
import { getCDNObject, getCDNPublicLink } from "@utils/cdnUtils";
import { fileTypeFromBuffer } from "file-type";

export default createElysia()
  .use(cdnModel)
  .post(
    "/download",
    async ({ body }) => {
      const chunks: Buffer[] = [];
      for await (const chunk of await getCDNObject(body.filename)) {
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
      return {
        data: getCDNPublicLink(body.filename),
        message: "success",
      };
    },
    {
      body: "cdn.download",
      tags: ["CDN"],
    }
  );
