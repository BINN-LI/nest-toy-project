import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user.schema';
import { UserRequestDto } from '../dto/user.request.dto';

export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // sub 아이디로 유저를 조회하기
  async findUserByIdWithoutPwd(payloadId: string): Promise<User | null> {
    const user = await this.userModel.findById(payloadId).select('-password');
    return user;
  }

  // 아이디 존재 여부 확인
  async existsById(id: string): Promise<boolean> {
    const result = await this.userModel.exists({ id });
    return result;
  }

  // 이메일 존재 여부 확인
  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.userModel.exists({ email });
    return result;
  }

  // 유저 생성
  async create(user: UserRequestDto): Promise<User> {
    return await this.userModel.create(user);
  }

  // 해당 아이디의 유저 리턴하기
  async findUserById(id: string): Promise<User | null> {
    return await this.userModel.findOne({ id });
  }
}
