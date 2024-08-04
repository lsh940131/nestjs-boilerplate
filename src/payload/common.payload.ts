import { ApiProperty } from '@nestjs/swagger';
import { ErrorCodeEnum } from '../enum/common.enum';
import { IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class ErrorPayload {
	constructor(message: string, code?: string) {
		this.message = message;
		this.code = code ? (Object.values(ErrorCodeEnum).includes(code as ErrorCodeEnum) ? (code as ErrorCodeEnum) : null) : null;
	}

	@ApiProperty({ description: '에러 메세지', default: 'error message' })
	message: string;

	@ApiProperty({ description: '에러 코드', default: null })
	@IsEnum(ErrorCodeEnum)
	code: string;
}

/**
 * 클라이언트 응답
 */
export class ResponsePayload {
	constructor(data: any, error: ErrorPayload) {
		this.data = data;
		this.error = error;
	}

	@ApiProperty({
		description: 'any type. 응답 데이터',
		default: null,
		required: false,
	})
	data: any;

	@ApiProperty({
		description: '응답 성공일 때 null. 에러가 났을 경우 참조. 형태는 ErrorPayload',
		default: null,
		nullable: true,
		required: false,
	})
	@Type(() => ErrorPayload)
	error: ErrorPayload | null;
}

export class CustomHttpException {
	constructor(statusCode: number, message: string, code?: string) {
		this.statusCode = statusCode;
		this.message = message;
		this.code = code ? (Object.values(ErrorCodeEnum).includes(code as ErrorCodeEnum) ? (code as ErrorCodeEnum) : null) : null;
	}

	statusCode: number;
	message: string;
	code: ErrorCodeEnum;
}
