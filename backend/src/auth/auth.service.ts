import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

const SALT_WORK_FACTOR = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    try {
      const { displayName, email, password } = signUpDto;

      const hashedPassword = await bcrypt.hash(password, SALT_WORK_FACTOR);

      const user = await this.userModel.create({
        displayName,
        email,
        password: hashedPassword,
      });

      const token = this.jwtService.sign(
        { id: user._id },
        {
          secret: this.config.get('JWT_SECRET'),
          expiresIn: this.config.get('JWT_EXPIRES'),
        },
      );

      return { token };
    } catch (e) {
      throw e;
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string } | Error> {
    try {
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        return new UnauthorizedException('Invalid email or password');
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        return new UnauthorizedException('Invalid email or password');
      }

      const token = this.jwtService.sign(
        { id: user._id },
        {
          secret: this.config.get<string>('JWT_SECRET'),
          expiresIn: this.config.get<string>('JWT_EXPIRES'),
        },
      );

      return { token };
    } catch (e) {
      throw e;
    }
  }
}
