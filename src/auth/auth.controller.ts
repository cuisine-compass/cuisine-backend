import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, JwtAuthGuard, LocalAuthGuard } from 'src/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ForgotPasswordDTO } from './dto/forgotPassword.dto';
import { UserDocument } from './user/user.schema';
import { ChangePasswordDto, ResetPasswordDTO } from './dto/resetPassword.dto';
import { Types } from 'mongoose';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) res: Response,
    @Body() body: any,
  ) {
    return 'here';
  }

  @Post('google')
  async handleGoogleLogin(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = body;
    const data = await this.authService.verifyGoogleToken(token);
    return await this.authService.googleRegister(data, res);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.authService.logout(res);
  }
}
