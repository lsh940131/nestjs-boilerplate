import { ApiProperty } from '@nestjs/swagger';
import { ErrorCodeEnum } from '../enum/errorCode.enum';
import { IsEnum } from 'class-validator';
import { IError } from '../interface/error.interface';

export class ErrorPayload {
	constructor(data: IError) {
		this.statusCode = data.statusCode;
		this.message = data.message;
		this.code = data.code ? (Object.values(ErrorCodeEnum).includes(data.code as ErrorCodeEnum) ? (data.code as ErrorCodeEnum) : null) : null;
	}

	statusCode: number;

	@ApiProperty({ description: '에러 메세지', default: 'error message' })
	message: string;

	@ApiProperty({ description: '에러 코드', default: null })
	@IsEnum(ErrorCodeEnum)
	code: string;
}
