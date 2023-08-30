import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './auth/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly appService: AppService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getHello() {
    const users = await this.userModel.find({});
    return this.appService.getHello() + users[0]._id;
  }
}
