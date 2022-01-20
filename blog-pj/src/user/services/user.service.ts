import { UserRepository } from '../repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserRequestDto } from '../dto/user.request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // * 회원가입 메서드
  async signUp(body: UserRequestDto) {
    const { id, password, name, age, email, gender } = body;

    const isIdExist = await this.userRepository.existsById(id);
    if (isIdExist) {
      throw new UnauthorizedException('해당 아이디는 이미 존재합니다');
    }

    const isEmailExist = await this.userRepository.existsByEmail(email);
    if (isEmailExist) {
      throw new UnauthorizedException('해당 이메일은 이미 존재합니다');
    }

    let upperGender = gender;
    if (gender !== ('F' || 'M')) {
      if (gender === ('f' || 'm')) {
        upperGender = gender.toUpperCase();
      } else {
        throw new UnauthorizedException('성별은 F 또는 M으로 작성해 주세요');
      }
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      id,
      password: hashedPwd,
      name,
      age,
      email,
      gender: upperGender,
    });

    return user.readOnlyUser;
  }
}
