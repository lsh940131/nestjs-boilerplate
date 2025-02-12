import { ApiProperty } from '@nestjs/swagger';

class AuthSign {
	token: string;
	pwdUpdatedAt: Date;
}
export class AuthSigninPayload {
	constructor(data: AuthSign) {
		this.token = data.token;
		this.pwdUpdatedAt = data.pwdUpdatedAt;
	}

	@ApiProperty({ default: 'token' })
	token: string;

	@ApiProperty({ default: new Date() })
	pwdUpdatedAt: Date;
}

class AuthGet {
	email: string;
	name: string;
	createdAt: Date;
	pwdUpdatedAt: Date;
}
export class AuthGetPayload {
	constructor(data: AuthGet) {
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
