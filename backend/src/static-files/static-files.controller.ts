import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { join } from 'path';

@Controller('recharge-receipts')
export class StaticFilesController {
  @Get(':filename')
  @UseGuards(JwtAuthGuard)
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', '../public/recharge-receipts', filename);
    res.sendFile(filePath);
  }
}
