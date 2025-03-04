import unzipper from "unzipper";

export const extractImages = async (zipBuffer: Buffer) => {
  if (!zipBuffer || zipBuffer.length === 0) {
    throw new Error("O buffer do arquivo ZIP está vazio ou inválido.");
  }

  try {
    const directory = await unzipper.Open.buffer(zipBuffer);
    return Promise.all(
      directory.files
        .filter((file) => file.path.match(/\.(jpg|jpeg|png)$/i)) // Filtra só imagens
        .map(async (file) => ({
          name: file.path,
          content: await file.buffer(),
        }))
    );
  } catch (error: any) {
    throw new Error("Falha ao extrair o arquivo ZIP: " + error.message);
  }
};
