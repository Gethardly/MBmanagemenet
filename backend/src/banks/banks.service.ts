import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banks } from './banks.schema';
import { BanksDto } from './banks.dto';

@Injectable()
export class BanksService {
  constructor(@InjectModel(Banks.name) private bankModal: Model<Banks>) {}

  async getBanks() {
    try {
      return this.bankModal.find();
    } catch (e) {
      return e;
    }
  }

  async createBank(bank: BanksDto) {
    try {
      return await this.bankModal.create(bank);
    } catch (e) {
      return e;
    }
  }

  async changeBank(changedBank: BanksDto) {
    try {
      return await this.bankModal.updateOne({_id: changedBank._id}, changedBank);
    } catch (e) {
      return e;
    }
  }

  async deleteBank(id: string) {
    try {
      return this.bankModal.deleteOne({_id: id});
    } catch (e) {
      return e;
    }
  }
}