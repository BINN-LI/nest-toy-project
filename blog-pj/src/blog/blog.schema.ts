import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions } from 'mongoose';
import { Comments } from 'src/comments/comments.schema';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Blog extends Document {
  @ApiProperty({
    example: '제목 예시',
    description: 'title',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '김가나',
    description: 'writer',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  writer: string;

  @ApiProperty({
    example: 'test_id',
    description: 'user id',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  writerId: string;

  @ApiProperty({
    example: '본문 예시',
    description: 'content',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  readonly readOnlyBlog: {
    _id: string;
    title: string;
    content: string;
    writer: string;
    writerId: string;
  };

  readonly comments: Comments[];
}

const _BlogSchema = SchemaFactory.createForClass(Blog);

_BlogSchema.virtual('readOnlyBlog').get(function (this: Blog) {
  return {
    _id: this._id,
    title: this.title,
    content: this.content,
    writer: this.writer,
    writerId: this.writerId,
    comments: this.comments,
  };
});

_BlogSchema.virtual('comments', {
  ref: 'comments',
  localField: '_id',
  foreignField: 'info',
});
_BlogSchema.set('toObject', { virtuals: true });
_BlogSchema.set('toJSON', { virtuals: true });

export const BlogSchema = _BlogSchema;
