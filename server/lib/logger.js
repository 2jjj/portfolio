import pino from "pino";
import { randomUUID } from "crypto";

const isDev = process.env.NODE_ENV !== "production" && !process.env.VERCEL;

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  ...(isDev
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "HH:MM:ss" },
        },
      }
    : {}),
  redact: ["req.headers.authorization", "req.headers.cookie", "body.password"],
});

export function createRequestId(req, _res, next) {
  req.requestId = randomUUID();
  req.log = logger.child({ requestId: req.requestId });
  next();
}

export default logger;
