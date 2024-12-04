import { fileTypeFromBuffer } from "file-type";

const isMetaDataImg = async (values: ArrayBuffer) => {
  const buffer = new Uint8Array(values);

  const type = await fileTypeFromBuffer(buffer);
  if (!type || !type.mime.startsWith("image/")) {
    return false;
  }
  return true;
};

export { isMetaDataImg };
