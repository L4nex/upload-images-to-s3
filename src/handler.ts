import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Busboy from "busboy";
import { Readable } from "stream";
import { extractFiles } from "./extract-zip";
import { uploadImagesToS3 } from "./upload";
import { validateToken } from "./auth-middleware";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!validateToken(event)) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Token inválido ou não fornecido" }),
      };
    }

    if (
      !event.body ||
      !event.headers["content-type"]?.includes("multipart/form-data")
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Nenhum arquivo enviado ou content-type inválido, esperado multipart/form-data",
        }),
      };
    }

    const contentType = event.headers["content-type"] || "multipart/form-data";
    const busboy = Busboy({ headers: { "content-type": contentType } });

    let fileBuffer: Buffer | null = null;

    busboy.on("file", (fieldname, file) => {
      if (fieldname === "file") {
        const chunks: Buffer[] = [];
        file.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });
        file.on("end", () => {
          fileBuffer = Buffer.concat(chunks);
        });
      }
    });

    const bodyBuffer = Buffer.from(
      event.body,
      event.isBase64Encoded ? "base64" : "utf8"
    );
    const bodyStream = new Readable();
    bodyStream.push(bodyBuffer);
    bodyStream.push(null);

    bodyStream.pipe(busboy);

    await new Promise((resolve, reject) => {
      busboy.on("finish", resolve);
      busboy.on("error", reject);
    });

    if (!fileBuffer) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Arquivo não encontrado" }),
      };
    }

    const images = await extractFiles(fileBuffer);
    const uploadedFiles = await uploadImagesToS3(images);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Upload concluído",
        files: uploadedFiles,
      }),
    };
  } catch (error: any) {
    console.error("Erro:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno", details: error.message }),
    };
  }
};
