import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtStrategy: JwtStrategy,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractJwtFromRequest(request);

    if (!token) {
      throw new ForbiddenException('Login first to access this endpoint.');
    }

    const user = await this.jwtStrategy.validate(token);

    if (!user) {
      return false;
    }

    request['user'] = user;
    return true;
  }

  private extractJwtFromRequest(request: Request) {
    const authHeader = request.headers['authorization'];
    if (authHeader) {
      const [bearer, token] = authHeader.split(' ');
      if (bearer === 'Bearer' && token) {
        return token;
      }
    }
    return null;
  }
}
