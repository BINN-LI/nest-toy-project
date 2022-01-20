import { BlogService } from '../../blog/services/blog.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { CommentsCreateDto } from '../dto/comments.create.dto';
import { Comments } from '../comments.schema';
import { CommentsUpdateDto } from '../dto/comments.update.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private readonly commentsModel: Model<Comments>,
    private readonly blogservice: BlogService,
  ) {}

  async getAllComments() {
    try {
      const comments = await this.commentsModel.find();
      return comments;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createComments(user: User, no: string, commentData: CommentsCreateDto) {
    try {
      const { contents } = commentData;
      const targetPost = await this.blogservice.getOnePost(no);

      const newComment = new this.commentsModel({
        author: user.id,
        contents,
        info: targetPost._id,
      });
      return await newComment.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateComments(user: User, no: string, comments: CommentsUpdateDto) {
    try {
      const { contents } = comments;
      const targetComment = await this.commentsModel.findOne({ no });

      if (user.id === targetComment.author) {
        const updateComment = await this.commentsModel.updateMany(
          { _id: no },
          { contents },
        );
        return updateComment;
      } else {
        throw new UnauthorizedException('본인의 댓글만 수정이 가능합니다.');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteComments(user: User, no: string) {
    try {
      const targetComment = await this.commentsModel.findOne({ no });

      if (user.id === targetComment.author) {
        const deleteComment = await this.commentsModel.deleteOne();
        return deleteComment;
      } else {
        throw new UnauthorizedException('본인의 댓글만 삭제가 가능합니다.');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async plusLike(no: string) {
    try {
      const targetComment = await this.commentsModel.findOne({ no });
      targetComment.likeCount += 1;
      return await targetComment.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
