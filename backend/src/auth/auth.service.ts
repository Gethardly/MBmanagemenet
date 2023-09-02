import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { IUser } from '../types';
import { Request } from 'express';

const SALT_WORK_FACTOR = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<IUser | Error> {
    try {
      const { displayName, email, password } = signUpDto;

      const duplicateEmail = await this.userModel.findOne({ email });

      if (duplicateEmail) {
        return new BadRequestException('This email already taken.');
      }

      const hashedPassword = await bcrypt.hash(password, SALT_WORK_FACTOR);

      const user = await this.userModel.create({
        displayName,
        email,
        password: hashedPassword,
      });

      user['token'] = this.jwtService.sign(
        { id: user._id },
        {
          secret: this.config.get('JWT_SECRET'),
          expiresIn: this.config.get('JWT_EXPIRES'),
        },
      );

      return user;
    } catch (e) {
      if (e.name === 'ValidationError') {
        console.log('here');
        return new UnprocessableEntityException({ error: e, data: 'hello' });
      }

      throw e;
    }
  }

  async login(loginDto: LoginDto): Promise<IUser | Error> {
    try {
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new UnauthorizedException({
          error: 'Invalid email or password',
        });
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        throw new UnauthorizedException({
          error: 'Invalid email or password',
        });
      }

      const token = this.jwtService.sign(
        { id: user._id },
        {
          secret: this.config.get<string>('JWT_SECRET'),
          expiresIn: this.config.get<string>('JWT_EXPIRES'),
        },
      );

      delete user['_doc'].password;

      return {
        ...user['_doc'],
        token,
      };
    } catch (e) {
      throw e;
    }
  }

  async changeUser(id: string, changeUser: SignUpDto): Promise<IUser | Error> {
    if (!mongoose.isValidObjectId(id)) {
      throw new UnprocessableEntityException('Invalid user id');
    }
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException({ error: 'Пользователь не найден.' });
      }

      const { email, displayName, password } = changeUser;
      if (email && email !== user.email) {
        user.email = email;
      }
      if (displayName && displayName !== user.displayName) {
        user.displayName = displayName;
      }
      if (password && password !== user.password) {
        user.password = await bcrypt.hash(password, SALT_WORK_FACTOR);
      }
      return await user.save();
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        return new UnprocessableEntityException(e);
      }
      throw e;
    }
  }

  async getUserInfo(id: string) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new UnprocessableEntityException('Invalid user id');
      }
      const user = Request['user'];
      if (user._id.toString() !== id) {
        throw new NotFoundException({ error: 'Пользователь не найден.' });
      }
      return user;
    } catch (e) {
      throw new e();
    }
  }
}
