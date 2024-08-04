import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	constructor(private readonly logger: LoggerService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const httpCtx = context.switchToHttp();
		const request = httpCtx.getRequest();
		const response = httpCtx.getResponse();

		return next.handle().pipe(
			tap(async (responseData) => {
				try {
					const userIdx = request.user ? request.user.userIdx : null;
					const { url, method, headers, body, query } = request;
					let ip = headers['x-forwarded-for'] || request.ip || '';

					// IPv4-매핑된 IPv6 주소 형식에서 IPv4 주소만 추출
					if (ip && ip.startsWith('::ffff:')) {
						ip = ip.replace('::ffff:', '');
					}

					const { statusCode } = response;

					await this.logger.create(userIdx, ip, url, method, headers, body, query, responseData, null, statusCode);
				} catch (err) {
					throw err;
				}
			}),
		);
	}
}
