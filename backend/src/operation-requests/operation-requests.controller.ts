import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OperationRequestsGateway } from './operation-requests.gateway';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { RechargeRequestDto } from './dto/rechargeRequestDto';
import { OperationRequestsService } from './operation-requests.service';

@Controller('operation-requests')
export class OperationRequestsController {
  constructor(
    private readonly operationRequestsGateway: OperationRequestsGateway,
    private operationRequestService: OperationRequestsService,
  ) {}

  @Post('payment')
  @UseInterceptors(
    FileInterceptor('paid_receipt', {
      storage: diskStorage({
        destination: './public/recharge-receipts',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const fileName = `${req.body.payment_date}-${uniqueSuffix}${ext}`;
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
    @Body() rechargeData: RechargeRequestDto,
  ) {
    try {
      const dataToSave = {
        ...rechargeData,
        filename: file.filename,
      };
      const savedData = await this.operationRequestService.saveInDB(dataToSave);
      this.operationRequestsGateway.sendToAll(dataToSave);

      return {
        savedData
      };
    } catch (err) {
      return err.message;
    }

  }
}
