import MinioClient from "@libs/minioClient";
import { fileTypeFromBuffer } from "file-type";

const isMetaDataImg = async (values: ArrayBuffer) => {
  const buffer = new Uint8Array(values);

  const type = await fileTypeFromBuffer(buffer);
  if (!type || !type.mime.startsWith("image/")) {
    return false;
  }
  return true;
};

const getCDNPublicLink = async (fileName: string) => {
  return await MinioClient.presignedUrl(
    "GET",
    Bun.env.MINIO_BUCKET_NAME!,
    fileName
  );
};

const getCDNObject = async (fileName: string) => {
  return await MinioClient.getObject(Bun.env.MINIO_BUCKET_NAME!, fileName);
};

export { isMetaDataImg, getCDNPublicLink, getCDNObject };
