import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Withdraw } from '../schema/withdraw.schema';
import { WithdrawDto } from '../dto/withdrawDto';
import { ChangeRechargeDto, GetRechargeDto } from '../dto/rechargeDto';

@Injectable()
export class WithdrawService {
  constructor(@InjectModel(Withdraw.name) private withdrawModal: Model<Withdraw>) {
  }

  async saveInDB(withdrawDto: WithdrawDto) {
    try {
      return await this.withdrawModal.create(withdrawDto);
    } catch (e) {
      throw e;
    }
  }

  async getAll(filters: GetRechargeDto) {
    try {
      const query: any = {
        createdAt: {
          $gte: filters.start_date,
          $lt: filters.end_date,
        },
      };

      if (filters.status !== undefined) {
        query.status = filters.status === "null" ? null : filters.status;
      }

      return await this.withdrawModal.find(query).sort({ createdAt: -1 });
    } catch (e) {
      throw e;
    }
  }

  async changeOne(id: string, newRecharge: ChangeRechargeDto) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new UnprocessableEntityException('Invalid note id');
      }
      const editedNote = await this.withdrawModal.updateOne({ _id: id }, newRecharge);
      if (editedNote.modifiedCount === 0 || editedNote.matchedCount === 0) {
        throw new UnprocessableEntityException('Invalid note id');
      }
      return editedNote;
    } catch (e) {
      throw e;
    }
  }
}