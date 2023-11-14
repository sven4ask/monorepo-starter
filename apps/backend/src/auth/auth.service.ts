import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserDocumentType } from '../user/models/user.model';
import { HasherService } from '../hasher/hasher.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UserService,
    private readonly hash: HasherService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<string | undefined> {
    const user = await this.validateUser(email, password);
    if (user) {
      return this.generateToken(user);
    }
  }

  private async validateUser(email: string, password: string): Promise<UserDocumentType> {
    const user = await this.user.getUserByEmail(email);
    if (user) {
      if(await this.hash.verify(password, user.password)) {
        return user;
      }
    }
  }

  private generateToken(user: UserDocumentType) {
    return this.jwtService.sign({
      sub: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  }
}
