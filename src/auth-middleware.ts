import { APIGatewayProxyEvent } from "aws-lambda";
import jwt from "jsonwebtoken";

export const validateToken = (event: APIGatewayProxyEvent): boolean => {
  const authHeader =
    event.headers["Authorization"] || event.headers["authorization"];

  if (!authHeader) {
    return false;
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return true;
  } catch (error) {
    return false;
  }
};
