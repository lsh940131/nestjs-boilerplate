import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ErrorPayload } from '../../common/payload/error.payload';
import { ErrorCodeEnum } from '../../common/enum/errorCode.enum';

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
	email: string;

	@ApiProperty({ default: 'tester' })
	name: string;

	@ApiProperty({ default: new Date() })
	createdAt: Date;

	@ApiProperty({ default: new Date() })
	pwdUpdatedAt: Date;
}

export class AuthSignupEmailDupPayload extends ErrorPayload {
	@ApiProperty({ description: '에러 메세지', default: 'Already use the email' })
	message: string;

	@ApiProperty({ description: '에러 코드', default: ErrorCodeEnum.SIGNUP_DUP_EMAIL })
	@IsEnum(ErrorCodeEnum)
	code: string;
}

export class AuthSigninFailPayload extends ErrorPayload {
	@ApiProperty({ description: '에러 메세지', default: 'Incorrect email or password' })
	message: string;

	@ApiProperty({ description: '에러 코드', default: '' })
	@IsEnum(ErrorCodeEnum)
	code: string;
}
