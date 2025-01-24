import { md5, Message } from "js-md5";
import { upload } from "../api/upload";

const readFile = async (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
export const uploadFileInChunks = (
  file: File,
  chunkSize = 1024 * 1024
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const fileSize = file.size;

    const fileName = file.name;

    const totalChunks = Math.ceil(fileSize / chunkSize);

    const fileContent = await readFile(file);
    const fileHash = md5(fileContent as Message); // 计算文件哈希值
    console.log(fileHash);
    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(
        chunkSize * i,
        Math.min(chunkSize * (i + 1), fileSize)
      );
      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("name", fileName);
      formData.append("size", fileSize.toString());
      formData.append("type", file.type);
      formData.append("offset", (chunkSize * i).toString());
      formData.append("hash", fileHash); // 文件哈希值
      console.log(formData);
      const res = await upload(formData);
      if (res.code !== 0) reject(res.data);
      if (i + 1 === totalChunks) {
        resolve(res.fileUrl);
      }
    }
  });
};
