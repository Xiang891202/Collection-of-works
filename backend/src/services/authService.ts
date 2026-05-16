import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/userRepository';
import { AuthMapper } from '../mappers/authMapper';
import { AppError } from '../utils/appError';
import { config } from '../config/index';
import { AuthDTO } from '../types/dto';

export class AuthService {
  private userRepo = new UserRepository();

  async login(email: string, password: string): Promise<AuthDTO> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new AppError('Invalid credentials', 401);

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return AuthMapper.toDTO(user, token);
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, config.jwt.secret) as {
        userId: string;
        email: string;
        role: string;
      };
    } catch {
      throw new AppError('Invalid token', 401);
    }
  }
}