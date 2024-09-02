import { Injectable } from '@nestjs/common';
import { Phone } from './phone.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PhoneDto } from './dto/phoneDto';

@Injectable()
export class PhoneService {
  private phoneIndices: { [key: string]: number } = {};
  constructor(@InjectModel(Phone.name) private bankModal: Model<Phone>) {}

  async getPhones(bank: string) {
    const phones = await this.bankModal.find({ bank });

    if (!phones || phones.length === 0) {
      return null;
    }

    if (this.phoneIndices[bank] === undefined) {
      this.phoneIndices[bank] = 0;
    }

    const index = this.phoneIndices[bank];
    const phone = phones[index];

    this.phoneIndices[bank] = (index + 1) % phones.length;

    return phone;
  }

  async createPhone(mbankPhone: PhoneDto) {
    try {
      return await this.bankModal.create(mbankPhone);
    } catch (e) {
      throw e;
    }
  }

  async changePhone(newPhone: PhoneDto) {
    try {
      return await this.bankModal.updateOne({_id: newPhone.id}, newPhone)
    } catch (e) {
      throw e
    }
  }

  async deletePhone(id: string) {
    try {
      return await this.bankModal.deleteOne({_id: id});
    } catch (e) {
      throw e;
    }
  }
}
