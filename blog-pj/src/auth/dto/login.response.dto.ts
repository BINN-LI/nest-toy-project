import { PickType } from '@nestjs/swagger';
import { User } from 'src/user/user.schema';

export class readOnlyLoginDto extends PickType(User, ['id'] as const) {}
