import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { IUser } from '../types';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

/*  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<IUser | Error> {
    return this.authService.signUp(signUpDto);
  }*/

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<IUser | Error> {
    return this.authService.login(loginDto);
  }

  @Put('/change-user/:id')
  @UseGuards(JwtAuthGuard)
  changeUser(@Param('id') id: string, @Body() changeUser: SignUpDto) {
    return this.authService.changeUser(id, changeUser);
  }

  @Get('/users/:id')
  @UseGuards(JwtAuthGuard)
  getUser(@Param('id') id: string) {
    return this.authService.getUserInfo(id);
  }
}
