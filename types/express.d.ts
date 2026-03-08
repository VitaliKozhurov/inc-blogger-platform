declare global {
  namespace Express {
    export interface Request {
      userId: string | null;
      login: string | null;
    }
  }
}

export {};
