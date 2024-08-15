import { Injectable } from '@nestjs/common';
import { MbankPhone } from './mbank-phone.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MbankPhoneDto } from './dto/mbank-phoneDto';

@Injectable()
export class MbankPhoneService {
  constructor(@InjectModel(MbankPhone.name) private mbankModal: Model<MbankPhone>) {
  }

  async getPhones() {
    return await this.mbankModal.find();
  }

  async createPhone(mbankPhone: MbankPhoneDto) {
    try {
      return await this.mbankModal.create(mbankPhone);
    } catch (e) {
      throw e;
    }
  }

  async changePhone(newPhone: MbankPhoneDto) {
    try {
      return await this.mbankModal.updateOne({_id: newPhone.id}, newPhone)
    } catch (e) {
      throw e
    }
  }

  async deletePhone(id: string) {
    try {
      return await this.mbankModal.deleteOne({_id: id});
    } catch (e) {
      throw e;
    }
  }
}
