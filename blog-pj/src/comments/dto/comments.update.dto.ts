import { PickType } from '@nestjs/swagger';
import { Comments } from '../comments.schema';

export class CommentsUpdateDto extends PickType(Comments, [
  'contents',
] as const) {}
