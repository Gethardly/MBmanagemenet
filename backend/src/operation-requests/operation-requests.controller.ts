import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OperationRequestsGateway } from './operation-requests.gateway';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { RechargeRequestDto } from './dto/rechargeRequestDto';

interface Operation {
  paid_receipt: string,

}

@Controller('operation-requests')
export class OperationRequestsController {
  constructor(private readonly operationRequestsGateway: OperationRequestsGateway) {}

  @Post('payment')
  @UseInterceptors(
    FileInterceptor('paid_receipt', {
      storage: diskStorage({
        destination: './public/receipts',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${req.body.payment_date}-${uniqueSuffix}${ext}`);
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
    @Body() reqData: RechargeRequestDto,
  ) {
    console.log('File:', file);
    console.log('Data:', reqData);
    this.operationRequestsGateway.sendToAll(reqData);

    return {
      message: 'File and data uploaded successfully',
      filePath: file.path,
    };
  }
}
