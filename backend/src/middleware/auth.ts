import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    const token = header.split(' ')[1];
    const payload = authService.verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (err: any) {
    return res.status(401).json({ success: false, error: err.message });
  }
}

export function adminGuard(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  next();
}