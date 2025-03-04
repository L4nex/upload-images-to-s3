import unzipper from "unzipper";
import { Readable } from "stream";

export const extractImages = async (zipBuffer: Buffer) => {
  if (!zipBuffer || zipBuffer.length === 0) {
    throw new Error("O buffer do arquivo ZIP está vazio ou inválido.");
  }

  try {
    const images: any = [];
    const stream = Readable.from(zipBuffer);

    await new Promise((resolve, reject) => {
      stream
        .pipe(unzipper.Parse())
        .on("entry", async (entry: unzipper.Entry) => {
          if (entry.type === "Directory") {
            entry.autodrain();
            return;
          }

          if (entry.path.match(/\.(jpg|jpeg|png|webp)$/i)) {
            const content = await entry.buffer();
            images.push({
              name: entry.path,
              content,
            });
          } else {
            entry.autodrain();
          }
        })
        .on("finish", resolve)
        .on("error", reject);
    });

    return images;
  } catch (error: any) {
    throw new Error("Falha ao extrair o arquivo ZIP: " + error.message);
  }
};