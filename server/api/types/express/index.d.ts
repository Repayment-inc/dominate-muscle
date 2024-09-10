import { JwtPayload } from "../../src/middleware/auth"; // JwtPayloadのパスを適切に設定してください

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
  type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
}
