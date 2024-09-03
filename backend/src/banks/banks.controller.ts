import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
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

  @Put()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async changeBank(@Body() newBank: BanksDto) {
    try {
      return await this.banksService.changeBank(newBank)
    } catch (e) {
      return e;
    }
  }
}