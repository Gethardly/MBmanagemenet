import { SetMetadata } from '@nestjs/common';
import { Request } from 'express';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const currentUser = Request['user'];

    return roles.some(role => currentUser.role === role);
  }
}
