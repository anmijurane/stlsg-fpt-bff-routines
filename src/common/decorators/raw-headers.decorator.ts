import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Headers = createParamDecorator((data, ctx: ExecutionContext) => {
  const { headers } = ctx.switchToHttp().getRequest();
  return headers;
});
