import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, JwtAuthGuard, RoleGuard, Roles } from 'src/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserDocument } from './user.schema';
import { UserService } from './user.service';
import { Request } from 'express';
import { InviteUserDTO } from './dto/invite-users-dto';

@Controller('user')
@UseGuards(RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
}
