import { ApiProperty } from '@nestjs/swagger';
import { IUserSignin, IUserGet } from './user.interface';

export class PUserSignin {
	constructor(data: IUserSignin) {
		this.token = data.token;
		this.pwdUpdatedAt = data.pwdUpdatedAt;
	}

	@ApiProperty({ default: 'token' })
	readonly token: string;

	@ApiProperty({ default: new Date() })
	readonly pwdUpdatedAt: Date;
}

export class PUserGet {
	constructor(data: IUserGet) {
		this.email = data.email;
		this.name = data.name;
		this.createdAt = data.createdAt;
		this.pwdUpdatedAt = data.pwdUpdatedAt;
	}

	@ApiProperty({ default: 'tester@test.com' })
	readonly email: string;

	@ApiProperty({ default: 'tester' })
	readonly name: string;

	@ApiProperty({ default: new Date() })
	readonly createdAt: Date;

	@ApiProperty({ default: new Date() })
	readonly pwdUpdatedAt: Date;
}
