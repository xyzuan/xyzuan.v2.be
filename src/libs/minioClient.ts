import * as Minio from "minio";

const MinioClient = new Minio.Client({
  endPoint: Bun.env.MINIO_HOST!,
  accessKey: Bun.env.MINIO_ACCESS_KEY!,
  secretKey: Bun.env.MINIO_SECRET_KEY!,
  useSSL: true,
});

export default MinioClient;
