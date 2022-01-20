import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogIn(data: LoginRequestDto): Promise<{ token: string }> {
    const { id, password } = data;

    const user: User = await this.userRepository.findUserById(id);

    if (user && (await bcrypt.compare(password, user.password))) {
      // * 유저 토큰 생성 ( 시크릿키 + payload 필요 )
      const payload = { id: id, sub: user._id };
      return {
        token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException(
        '아이디와 비밀번호를 다시 확인해 주세요.',
      );
    }
  }
}
