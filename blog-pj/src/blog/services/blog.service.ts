import { CommentsSchema } from './../../comments/comments.schema';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Blog } from '../blog.schema';
import { BlogRequestDto } from '../dto/blog.request.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
  ) {}

  async getAllPost() {
    const CommentsModel = mongoose.model('comments', CommentsSchema);
    const result: Blog[] = await this.blogModel
      .find()
      .populate('comments', CommentsModel);
    const readOnlyBlog = result.map((blog) => blog.readOnlyBlog);
    return readOnlyBlog;
  }

  async getAllPostByLoginUser(user: User, paramId: string) {
    if (user.id !== paramId) {
      throw new UnauthorizedException('본인이 작성한 글만 확인할 수 있습니다.');
    } else {
      const myPost: Blog[] = await this.blogModel.find({ writerId: paramId });
      if (myPost.length === 0) {
        return '작성한 글이 없습니다.';
      } else {
        const readOnlyPost = myPost.map((blog) => blog.readOnlyBlog);
        return readOnlyPost;
      }
    }
  }

  async getOnePost(no: string) {
    const onePost: Blog = await this.blogModel.findOne({ _id: no });

    if (onePost._id.toString() !== no) {
      throw new UnauthorizedException('해당 포스트는 존재하지 않습니다.');
    } else {
      return onePost.readOnlyBlog;
    }
  }

  async createPost(user: User, postData: BlogRequestDto) {
    const { title, content } = postData;

    const post = await this.blogModel.create({
      writer: user.name,
      writerId: user.id,
      title,
      content,
    });

    return post.readOnlyBlog;
  }

  async updatePost(no: string, updateData: BlogRequestDto, user: User) {
    const { title, content } = updateData;
    const post = await this.blogModel.findOne({ _id: no });

    if (post._id.toString() !== no) {
      throw new UnauthorizedException('해당 포스트는 존재하지 않습니다.');
    } else {
      if (user.id === post.writerId) {
        const rePost = await this.blogModel.updateMany(
          { _id: no },
          { title, content },
        );
        return rePost;
      } else {
        throw new UnauthorizedException('본인의 포스트만 수정이 가능합니다.');
      }
    }
  }

  async deletePost(user: User, no: string) {
    const post = await this.blogModel.findOne({ _id: no });

    if (post._id.toString() !== no) {
      throw new UnauthorizedException('해당 포스트는 존재하지 않습니다.');
    } else {
      if (user.id === post.writerId) {
        const result = await this.blogModel.deleteOne();
        return result;
      } else {
        throw new UnauthorizedException('본인의 포스트만 삭제 가능합니다.');
      }
    }
  }
}
