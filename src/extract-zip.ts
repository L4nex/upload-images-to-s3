import unzipper from "unzipper";
import { Readable } from "stream";

export const extractFiles = async (zipBuffer: Buffer) => {
  if (!zipBuffer || zipBuffer.length === 0) {
    throw new Error("O buffer do arquivo ZIP está vazio ou inválido.");
  }

  try {
    const files: { name: string; content: Buffer }[] = [];
    const stream = Readable.from(zipBuffer);

    await new Promise((resolve, reject) => {
      stream
        .pipe(unzipper.Parse())
        .on("entry", async (entry: unzipper.Entry) => {
          const isHiddenFileOrFolder = entry.path.split("/").some((part) => part.startsWith(".") || part.startsWith("__MACOSX"));

          if (isHiddenFileOrFolder || entry.type === "Directory") {
            entry.autodrain();
            return;
          }

          const content = await entry.buffer();
          files.push({
            name: entry.path,
            content,
          });
        })
        .on("finish", resolve)
        .on("error", reject);
    });

    return files;
  } catch (error: any) {
    throw new Error("Falha ao extrair o arquivo ZIP: " + error.message);
  }
};
