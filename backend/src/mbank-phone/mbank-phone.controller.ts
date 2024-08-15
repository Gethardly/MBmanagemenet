import { Controller, Get } from '@nestjs/common';

@Controller('mbank-phone')
export class MbankPhoneController {
  private phones = ['+996700715499', '+996777777777', '+996708552267', '+996888888888'];
  private currentIndex = 0;
  @Get('')
  getMbankPhone() {
    const phone = this.phones[this.currentIndex];

    this.currentIndex = (this.currentIndex + 1) % this.phones.length;

    return {
      phone
    };
  }
}
