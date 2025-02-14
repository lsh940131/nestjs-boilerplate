import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DAuth } from './auth.dto';

export const Auth = createParamDecorator((data: unknown, ctx: ExecutionContext): DAuth => {
	const request = ctx.switchToHttp().getRequest();

	return request.user;
});
