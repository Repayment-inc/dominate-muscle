import { JwtPayload } from "../../src/middleware/auth"; // JwtPayloadのパスを適切に設定してください

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
