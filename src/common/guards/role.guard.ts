import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtStrategy } from '../strategies';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  async canActivate(context: ExecutionContext) {
    const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;
    if (!jwt) return true;
    const roles = this.reflector.get<string>('roles', context.getHandler());

    if (!roles) {
      return true;
    }
    const user = await this.jwtStrategy.validateToken(jwt);
    return roles.includes(user?.role);
  }
}
