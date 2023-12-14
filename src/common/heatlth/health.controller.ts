import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/')
export class HealthController {
  @Get()
  health(@Res() res: Response) {
    return res.send('Welcome to the cuisine!');
  }
}
