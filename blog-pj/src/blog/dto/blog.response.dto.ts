import { PickType } from '@nestjs/swagger';
import { Blog } from '../blog.schema';

export class BlogResponseDto extends PickType(Blog, [
  '_id',
  'writer',
  'writerId',
  'title',
  'content',
] as const) {}
