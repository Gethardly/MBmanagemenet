import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Query, Put
} from '@nestjs/common';
import { OperationRequestsGateway } from './operation-requests.gateway';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { GetRechargeDto, RechargeRequestsDto } from './dto/rechargeDto';
import { RechargeService } from './services/recharge.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { WithdrawDto } from './dto/withdrawDto';
import { WithdrawService } from './services/withdraw.service';

@Controller('operation-requests')
export class OperationRequestsController {
  constructor(
    private readonly operationRequestsGateway: OperationRequestsGateway,
    private  rechargeService:RechargeService,
    private withdrawService: WithdrawService,
  ) {
  }

  @Post('payment')
  @UseInterceptors(
    FileInterceptor('paid_receipt', {
      storage: diskStorage({
        destination: './public/recharge-receipts',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const fileName = `${req.body.payment_date.replace(/[:.]/g, '-')}-${uniqueSuffix}${ext}`;
          callback(null, fileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = /\/(jpg|jpeg|png|gif|pdf)$/;
        if (!file.mimetype.match(allowedMimeTypes)) {
          callback(new BadRequestException('Unsupported file type'), false);
        } else {
          callback(null, true);
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() rechargeData: RechargeRequestsDto,
  ) {
    try {
      const dataToSave = {
        ...rechargeData,
        filename: file.filename,
      };
      const savedData = await this.rechargeService.saveInDB(dataToSave);
      this.operationRequestsGateway.sendToAll(savedData);

      return {
        savedData
      };
    } catch (err) {
      return err.message;
    }
  }

  @Post('withdraw')
  async withdraw(@Body() withdrawData: WithdrawDto) {
    const savedData = await this.withdrawService.saveInDB(withdrawData);

    this.operationRequestsGateway.sendToAll(savedData);
    return {
      savedData
    };
  }

  @Get('payments')
  @UseGuards(JwtAuthGuard)
  getPayments(@Query() filterData: GetRechargeDto) {
    return this.rechargeService.getAll(filterData);
  }

  @Get('withdrawals')
  @UseGuards(JwtAuthGuard)
  getWithdrawals(@Query() filterData: GetRechargeDto) {
    return this.withdrawService.getAll(filterData);
  }

  @Put('payment')
  @UseGuards(JwtAuthGuard)
  changePayment(newPayment) {
    return
  }
}
