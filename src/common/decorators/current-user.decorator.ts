import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDocument } from 'src/auth/user/user.schema';

export const getCurrentUserByContext = (
  context: ExecutionContext,
): UserDocument => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    return getCurrentUserByContext(context);
  },
);
