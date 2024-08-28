import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { IUser } from '../types';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { UserDocument } from './schemas/user.schema';
import { Roles, RolesGuard } from './jwt/jwt.roles.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('/signup')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  signUp(@Body() signUpDto: SignUpDto): Promise<UserDocument | Error> {
    return this.authService.signUp(signUpDto);
  }

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

  @Get('/users')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUsers(@Query('page') page: string,
                 @Query('perPage') perPage: string,) {
    let pageNumber = parseInt(page);
    let perPageNumber = parseInt(perPage);
    pageNumber = isNaN(pageNumber) || pageNumber <= 0 ? 1 : pageNumber;
    perPageNumber = isNaN(perPageNumber) || perPageNumber <= 0 ? 10 : perPageNumber;

    const [count, users] = await this.authService.findAndCountAll(pageNumber, perPageNumber);

    let pages = Math.ceil(count / perPageNumber);
    if (pages === 0) pages = 1;
    if (pageNumber > pages) pageNumber = pages;

    return {
      users,
      page: pageNumber,
      pages,
      count,
      perPage: perPageNumber,
    };
  }

  @Delete('/users/:id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
}
