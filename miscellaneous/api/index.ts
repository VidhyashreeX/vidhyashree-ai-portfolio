import express, { type NextFunction, type Request, type Response } from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

const app = express();
const httpServer = createServer(app);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

registerRoutes(httpServer, app).catch((err) => {
  console.error("Failed to register API routes:", err);
});

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (res.headersSent) {
    return next(err);
  }

  return res.status(status).json({ message });
});

export default app;
