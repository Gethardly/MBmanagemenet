import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RechargeRequestDto } from './dto/rechargeRequestDto';
import { Recharge } from './schema/recharge.schema';

@Injectable()
export class OperationRequestsService {
  constructor(@InjectModel(Recharge.name) private rechargeModel: Model<Recharge>) {}

  async saveInDB(rechargeDto: RechargeRequestDto) {
    try {
      return await this.rechargeModel.create(rechargeDto);
    } catch (e) {
      throw e;
    }
  }

  async getAll() {
    try {
      return await this.rechargeModel.find();
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

  async changeOne(id: string, newNote: RechargeRequestDto) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new UnprocessableEntityException('Invalid note id');
      }
      const editedNote = await this.rechargeModel.updateOne({ _id: id }, newNote);
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
