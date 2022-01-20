import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../services/user.service';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  // UseInterceptors,
  // UseFilters,
} from '@nestjs/common';
import { UserRequestDto } from '../dto/user.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { readOnlyUserDto } from '../dto/user.response.dto';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { readOnlyLoginDto } from 'src/auth/dto/login.response.dto';
// import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
// import { HttpExceptionFilter } from './../common/exceptions/http-excepton.filter';

// @UseInterceptors(SuccessInterceptor)
// @UseFilters(HttpExceptionFilter)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 유저의 정보' })
  @ApiResponse({
    status: 500,
    description: 'server error',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: readOnlyUserDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@CurrentUser() user) {
    return user.readOnlyUser;
  }

  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 500,
    description: 'server error',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: readOnlyUserDto,
  })
  @Post('signup')
  async signUp(@Body() body: UserRequestDto) {
    return await this.userService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 500,
    description: 'server error',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: readOnlyLoginDto,
  })
  @Post('login')
  logIn(@Body() data: LoginRequestDto): Promise<{ token: string }> {
    return this.authService.jwtLogIn(data);
  }
}
