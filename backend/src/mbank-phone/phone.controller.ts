import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PhoneService } from './phone.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { PhoneDto } from './dto/phoneDto';
import { BankPhonesEnum } from '../types';
import { Roles, RolesGuard } from '../auth/jwt/jwt.roles.guard';

@Controller('phone')
export class PhoneController {
  constructor(
    private  mbankService: PhoneService,
  ) {
  }
  @Get()
  async getMbankPhone(@Query('bank') bank: BankPhonesEnum) {
    return this.mbankService.getPhones(bank);
  }

  @Post('')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createMbankPhone(@Body() phone: PhoneDto) {
    const savedData = await this.mbankService.createPhone(phone);
    return {
      savedData
    }
  }

  @Put()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async changeMbankPhone(@Body() newPhone: PhoneDto) {
    return await this.mbankService.changePhone(newPhone)
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteOneNote(@Param('id') id: string) {
    return this.mbankService.deletePhone(id);
  }
}
