import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	constructor(private readonly loggerService: LoggerService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const httpCtx = context.switchToHttp();
		const request = httpCtx.getRequest();
		const response = httpCtx.getResponse();

		return next.handle().pipe(
			tap(async (responsePayload) => {
				try {
					const { url, method, headers, body, query } = request;
					const { statusCode } = response;
					const userIdx = request.user ? request.user.userIdx : null;
					const token = headers['authorization'];

					let ip = headers['x-forwarded-for'] || request.ip || '';
					// IPv4-매핑된 IPv6 주소 형식에서 IPv4 주소만 추출
					if (ip && ip.startsWith('::ffff:')) {
						ip = ip.replace('::ffff:', '');
					}

					const loggerParam = {
						ip,
						method,
						url,
						headers,
						body,
						query,
						responsePayload,
						error: null,
						statusCode,
						userIdx,
						token,
					};
					await this.loggerService.create(loggerParam);
				} catch (err) {
					// TODO: exception 발생은 시키지 않되, slack으로 개발자에게 알림 주기
				}
			}),
		);
	}
}
