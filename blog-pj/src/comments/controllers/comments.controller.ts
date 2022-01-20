import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/user.schema';
import { CommentsCreateDto } from '../dto/comments.create.dto';
import { CommentsService } from '../services/comments.service';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: '포스트에 적힌 댓글 모두 가져오기' })
  @Get()
  async getAllComments() {
    return this.commentsService.getAllComments();
  }

  @ApiOperation({ summary: '댓글 작성하기' })
  @Post(':no')
  async createComments(
    @CurrentUser() user: User,
    @Param('no') no: string,
    @Body() body: CommentsCreateDto,
  ) {
    return this.commentsService.createComments(user, no, body);
  }

  @ApiOperation({ summary: '댓글 수정하기' })
  @Put(':no')
  async updateComments(
    @CurrentUser() user: User,
    @Param('no') no: string,
    @Body() body: CommentsCreateDto,
  ) {
    return this.commentsService.updateComments(user, no, body);
  }

  @ApiOperation({ summary: '댓글 삭제하기' })
  @Delete(':no')
  async deleteComments(@CurrentUser() user: User, @Param('no') no: string) {
    return this.commentsService.deleteComments(user, no);
  }

  @ApiOperation({ summary: '좋아요 수 올리기' })
  @Patch(':no')
  async plusLike(@Param('no') no: string) {
    return this.commentsService.plusLike(no);
  }
}
