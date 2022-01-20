import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';
import { IsString, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const options: SchemaOptions = {
  collection: 'comments',
  timestamps: true,
};

@Schema(options)
export class Comments extends Document {
  @ApiProperty({
    description: '댓글 작성자 id',
    required: true,
  })
  @Prop({
    required: true,
    ref: 'cats',
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    description: '작성한 댓글 내용',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  contents: string;

  @ApiProperty({
    description: '좋아요 수',
  })
  @Prop({
    default: 0,
    required: true,
  })
  @IsPositive()
  likeCount: number;

  @ApiProperty({
    description: '댓글이 달린 게시글 id',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'blog',
  })
  @IsNotEmpty()
  info: string;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
