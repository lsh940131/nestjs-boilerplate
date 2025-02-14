import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DAuthCreateJwt {
	@ApiProperty({ required: true, default: 1 })
	@IsNotEmpty()
	@IsNumber()
	readonly idx: number;
}

export class DAuth {
	constructor(idx: number, jwt: string) {
		(this.idx = idx), (this.jwt = jwt);
	}

	readonly idx: number;
	readonly jwt: string;
}
