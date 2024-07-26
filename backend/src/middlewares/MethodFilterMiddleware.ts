import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MethodFilterMiddleware implements NestMiddleware {
  private readonly whitelist = [
    { domain: 'http://localhost:8000', methods: ['GET','POST'] },
    { domain: 'http://example.com', methods: ['GET', 'HEAD', 'PUT'] },
  ];

  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin as string;
    const allowed = this.whitelist.find(entry => entry.domain === origin);

    if (allowed && !allowed.methods.includes(req.method)) {
      throw new ForbiddenException('Method not allowed for this origin');
    }

    next();
  }
}
