import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Busboy from "busboy";
import { Readable } from "stream";
import { extractImages } from "./extract-zip";
import { uploadImagesToS3 } from "./upload";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log(event);
    console.log("EVENTO", event.body);
    console.log("HEADERS", event.headers["content-type"]);
    console.log(event.headers["content-type"]?.includes("multipart/form-data"));
    if (
      !event.body ||
      !event.headers["content-type"]?.includes("multipart/form-data")
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Nenhum arquivo enviado ou Content-Type inválido",
        }),
      };
    }

    const contentType = event.headers["content-type"] || "multipart/form-data";
    const busboy = Busboy({ headers: { "content-type": contentType } });

    let fileBuffer: Buffer | null = null;
    let path: string | null = null;

    busboy.on("field", (fieldname, value) => {
      if (fieldname === "path") {
        path = value;
      }
    });

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

    if (!fileBuffer || !path) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Arquivo ou caminho não encontrado" }),
      };
    }

    const images = await extractImages(fileBuffer);
    const uploadedFiles = await uploadImagesToS3(images, path);

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
