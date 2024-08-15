import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { MbankPhoneService } from './mbank-phone.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { MbankPhoneDto } from './dto/mbank-phoneDto';

@Controller('mbank-phone')
export class MbankPhoneController {
  constructor(
    private  mbankService: MbankPhoneService,
  ) {
  }
  @Get('')
  getMbankPhone() {
    return this.mbankService.getPhones();
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createMbankPhone(@Body() phone: MbankPhoneDto) {
    const savedData = await this.mbankService.createPhone(phone);
    return {
      savedData
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async changeMbankPhone(@Body() newPhone: MbankPhoneDto) {
    return await this.mbankService.changePhone(newPhone)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteOneNote(@Param('id') id: string) {
    return this.mbankService.deletePhone(id);
  }
}
