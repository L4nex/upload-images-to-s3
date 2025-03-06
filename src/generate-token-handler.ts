import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import jwt from "jsonwebtoken";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Corpo da requisição inválido",
        }),
      };
    }

    const { username, password } = JSON.parse(event.body);

    const validUsername = process.env.USERNAME!;
    const validPassword = process.env.PASSWORD!;

    if (username !== validUsername || password !== validPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error:
            "Credenciais inválidas, tente novamente ou entre em contato com o administrador.",
        }),
      };
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET!, {
      expiresIn: "12h",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error: any) {
    console.error("Erro:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno", details: error.message }),
    };
  }
};
