import { UserRepository } from '../../user/repositories/user.repository';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${process.env.JWT_SECRET}`,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const user: User = await this.userRepository.findUserByIdWithoutPwd(
      payload.sub,
    );

    if (user) {
      return user;
    } else {
      throw new UnauthorizedException('접근 오류입니다');
    }
  }
}
