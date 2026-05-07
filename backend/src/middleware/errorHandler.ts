import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { ResponseBuilder } from '../services/responseBuilder';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      ResponseBuilder.error(err.message, req.query.mode as string)
    );
  }

  console.error('Unexpected error:', err);
  return res.status(500).json(
    ResponseBuilder.error('Internal server error')
  );
}