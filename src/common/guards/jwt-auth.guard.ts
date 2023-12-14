import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  //   async canActivate(
  //     context: ExecutionContext,
  //   ): Promise<boolean | Observable<boolean>> {
  //     const canActivate = (await super.canActivate(context)) as boolean;
  //     if (canActivate) {
  //       const request = context.switchToHttp().getRequest();
  //       const user = request.user;
  //       if (user && user.accountStatus !== 'ACTIVE') {
  //         throw new UnauthorizedException(
  //           `Your account is currently ${user.accountStatus}`,
  //         );
  //       }
  //     }
  //     return canActivate;
  //   }
}
