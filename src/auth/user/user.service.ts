import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { generateOTP } from 'src/common';
import { Types } from 'mongoose';
import * as fs from 'fs';
import { GoogleUserDTO } from './dto/googleUser.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { FindUserDTO } from './dto/find-user.dto';
import { UserRepository } from './user.repository';
import { UserDocument } from './user.schema';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createObject: any) {
    try {
      await this.validateCreateUserDTO(createObject);
      const user = await this.userRepository.create({
        ...(createObject as UserDocument),
        password: await bcrypt.hash(createObject.password, 10),
      });
      return { ...user, password: undefined };
    } catch (error) {
      if (error.message.includes('duplicate key error')) {
        if (error.message.includes('email')) {
          throw new UnprocessableEntityException(
            'a user with this email already exists',
          );
        }
        if (error.message.includes('phoneNumber')) {
          throw new UnprocessableEntityException(
            'a user with this phoneNumber already exists',
          );
        }
      }

      throw new UnprocessableEntityException(error.message);
    }
  }

  async createGoogleUser(data: GoogleUserDTO) {
    try {
      const { email, given_name, family_name } = data;

      const userDetails = {
        firstName: given_name,
        lastName: family_name,
        email: email,
      };
      const user = await this.userRepository.create({
        ...(userDetails as UserDocument),
      });
      return { ...user, password: undefined };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return this.userRepository.findOne({
        email: email,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private async validateCreateUserDTO(createObject: CreateUserDTO) {
    try {
      return this.userRepository.findOne({
        email: createObject.email,
      });
    } catch (error) {
      throw new UnprocessableEntityException(
        'a user with this email already exists',
      );
    }
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('invalid credentials');
    }
    return user;
  }

  async updateUser(id: Types.ObjectId, updateObject: Partial<CreateUserDTO>) {
    const updated = await this.userRepository.findOneAndUpdate(
      { _id: id },
      updateObject,
    );
    return updated;
  }

  async getUser(getUserDto: FindUserDTO) {
    return this.userRepository.findOne(getUserDto);
  }

  async getUserById(id: Types.ObjectId) {
    return this.userRepository.findOne({ _id: id });
  }
}
