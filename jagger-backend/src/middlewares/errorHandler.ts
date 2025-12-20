import type { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  status?: number;
  details?: any;
}

export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Server Error';
  res.status(status).json({ message, details: err.details || null });
};
