import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ResponsePayload, ErrorPayload, CustomHttpException } from '../payload/common.payload';
import { LoggerService } from 'src/logger/logger.service';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
	constructor(private readonly loggerService: LoggerService) {}

	async catch(exception: Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest();
		const response = ctx.getResponse<Response>();

		let statusCode: number = 200;
		let res: ResponsePayload;
		if (exception instanceof ResponsePayload) {
			res = exception;
		} else if (exception instanceof ErrorPayload) {
			res = new ResponsePayload(null, exception);
		} else if (exception instanceof BadRequestException) {
			statusCode = 400;
			const validationErrorMsg = this.extractValidationErrorMsg(exception.getResponse());
			res = new ResponsePayload(400, new ErrorPayload(validationErrorMsg));
		} else if (exception instanceof HttpException) {
			statusCode = exception.getStatus();
			res = new ResponsePayload(null, new ErrorPayload(exception.message));
		} else if (exception instanceof CustomHttpException) {
			statusCode = exception.statusCode;
			res = new ResponsePayload(null, new ErrorPayload(exception.message, exception.code));
		} else {
			console.log(exception);
			statusCode = 500;
			res = new ResponsePayload(null, new ErrorPayload('Internal Server Error'));
		}

		const userIdx = request.user ? request.user.userIdx : null;
		const { url, method, headers, body, query } = request;
		const ip = headers['x-forwarded-for'] || request.ip || '';
		const errorResponse = exception instanceof HttpException ? exception.getResponse() : exception;

		await this.loggerService.create(userIdx, ip, url, method, headers, body, query, null, errorResponse, statusCode);

		response.status(statusCode).json(res);
	}

	private extractValidationErrorMsg(response: any): string {
		const validationResponse = response as { message: any; error: string; statusCode: number };
		if (Array.isArray(validationResponse.message)) {
			return validationResponse.message.join(', ');
		}
		return validationResponse.message;
	}
}
