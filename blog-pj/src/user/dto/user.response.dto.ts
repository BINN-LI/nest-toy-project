import { OmitType } from '@nestjs/swagger';
import { User } from '../user.schema';

export class readOnlyUserDto extends OmitType(User, ['password'] as const) {}
