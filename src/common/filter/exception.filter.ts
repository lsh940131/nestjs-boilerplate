import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ErrorPayload } from '../../common/payload/error.payload';
import { LoggerService } from '../../logger/logger.service';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
	constructor(private readonly loggerService: LoggerService) {}

	async catch(exception: Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest();
		const response = ctx.getResponse<Response>();

		let statusCode: number = 500;
		let res: ErrorPayload;
		if (exception instanceof ErrorPayload) {
			statusCode = exception.statusCode;
			res = exception;
		} else if (exception instanceof BadRequestException) {
			statusCode = 400;
			const validationErrorMsg = this.extractValidationErrorMsg(exception.getResponse());
			res = new ErrorPayload({ message: validationErrorMsg });
		} else if (exception instanceof HttpException) {
			statusCode = exception.getStatus();
			res = new ErrorPayload({ message: exception.message });
		} else {
			console.log(exception);
			statusCode = 500;
			res = new ErrorPayload({ message: 'Internal Server Error' });
		}

		// exception 발생 시 loggerService.create

		response.status(statusCode).json({
			message: res.message,
			code: res.code,
		});
	}

	private extractValidationErrorMsg(response: any): string {
		const validationResponse = response as { message: any; error: string; statusCode: number };
		if (Array.isArray(validationResponse.message)) {
			return validationResponse.message.join(', ');
		}
		return validationResponse.message;
	}
}
