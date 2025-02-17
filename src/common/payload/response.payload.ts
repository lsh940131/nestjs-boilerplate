import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ErrorPayload } from './error.payload';

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
	readonly data: any;

	@ApiProperty({
		description: '응답 성공일 때 null. 에러가 났을 경우 참조. 형태는 ErrorPayload',
		default: null,
		nullable: true,
		required: false,
	})
	@Type(() => ErrorPayload)
	readonly error: ErrorPayload | null;
}
