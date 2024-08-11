import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ChangeRechargeDto, GetRechargeDto, RechargeRequestsDto } from './dto/rechargeDto';
import { Recharge } from './schema/recharge.schema';

@Injectable()
export class OperationRequestsService {
  constructor(@InjectModel(Recharge.name) private rechargeModel: Model<Recharge>) {}

  async saveInDB(rechargeDto: RechargeRequestsDto) {
    try {
      return await this.rechargeModel.create(rechargeDto);
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

      return await this.rechargeModel.find(query).sort({ createdAt: -1 });
    } catch (e) {
      throw e;
    }
  }

  async getOneFromDB(id: string) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new UnprocessableEntityException('Invalid note id');
      }
      const note = await this.rechargeModel.findOne({ _id: id });
      if (!note) {
        throw new UnprocessableEntityException('Invalid note id');
      }
      return note;
    } catch (e) {
      throw e;
    }
  }

  async changeOne(id: string, newRecharge: ChangeRechargeDto) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new UnprocessableEntityException('Invalid note id');
      }
      const editedNote = await this.rechargeModel.updateOne({ _id: id }, newRecharge);
      if (editedNote.modifiedCount === 0 || editedNote.matchedCount === 0) {
        throw new UnprocessableEntityException('Invalid note id');
      }
      return editedNote;
    } catch (e) {
      throw e;
    }
  }

  async deleteOne(id: string) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new UnprocessableEntityException('Invalid note id');
      }
      const deletedNote = await this.rechargeModel.deleteOne({ _id: id });
      if (deletedNote.deletedCount === 0) {
        throw new UnprocessableEntityException('Invalid note id');
      }
      return deletedNote;
    } catch (e) {
      throw e;
    }
  }
}
