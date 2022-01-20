import { PickType } from '@nestjs/swagger';
import { Blog } from '../blog.schema';

export class BlogRequestDto extends PickType(Blog, [
  'title',
  'content',
] as const) {}
