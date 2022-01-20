import { BlogService } from '../services/blog.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  // UseInterceptors,
  // UseFilters,
} from '@nestjs/common';
import { BlogRequestDto } from '../dto/blog.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/user.schema';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlogResponseDto } from '../dto/blog.response.dto';
// import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
// import { HttpExceptionFilter } from './../common/exceptions/http-excepton.filter';

// @UseInterceptors(SuccessInterceptor) // 전역에서 사용해서 주석 처리
// @UseFilters(HttpExceptionFilter) // 전역에서 사용해서 주석 처리
@Controller('blog')
@UseGuards(JwtAuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({ summary: '모든 글 가지고 오기' })
  @ApiResponse({
    status: 500,
    description: 'server error',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: BlogResponseDto,
  })
  @Get()
  getAllPost() {
    return this.blogService.getAllPost();
  }

  @ApiOperation({ summary: '본인이 작성한 모든 글 가지고 오기' })
  @Get('mypage/:id')
  getAllPostByLoginUser(@CurrentUser() user: User, @Param('id') id: string) {
    return this.blogService.getAllPostByLoginUser(user, id);
  }

  @ApiOperation({ summary: '특정 게시글 가지고 오기' })
  @Get(':no')
  getOnePost(@Param('no') _id: string) {
    return this.blogService.getOnePost(_id);
  }

  @ApiOperation({ summary: '게시글 작성하기' })
  @Post()
  createPost(@CurrentUser() user: User, @Body() postData: BlogRequestDto) {
    return this.blogService.createPost(user, postData);
  }

  @ApiOperation({ summary: '본인 게시글 수정하기' })
  @Patch(':no/update')
  updatePost(
    @Param('no') postId: string,
    @Body() updateData,
    @CurrentUser() user: User,
  ) {
    return this.blogService.updatePost(postId, updateData, user);
  }

  @ApiOperation({ summary: '본인 게시글 삭제하기' })
  @Delete(':_id/delete')
  deletePost(@CurrentUser() user: User, @Param('_id') postId: string) {
    return this.blogService.deletePost(user, postId);
  }
}
