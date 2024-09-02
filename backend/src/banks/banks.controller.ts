import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BanksService } from './banks.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Roles } from '../auth/jwt/jwt.roles.guard';
import { BanksDto } from './banks.dto';

@Controller('banks')
export class BanksController {

  constructor(
    private  banksService: BanksService,
  ) {
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async getBanks() {
    return await this.banksService.getBanks();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async createBank(@Body() bank: BanksDto) {
    try {
      return await this.banksService.createBank(bank);
    } catch (e) {
      return e;
    }
  }
}