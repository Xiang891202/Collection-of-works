import { AuthDTO } from '../types/dto';

export class AuthMapper {
  static toDTO(user: any, token: string): AuthDTO {
    return {
      token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}