import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsOptional } from 'class-validator';

export class DUserSignup {
	@ApiProperty({ required: true, default: 'test@test.com', minLength: 1, maxLength: 100 })
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	readonly email: string;

	@ApiProperty({ required: true, default: 'pwd', minLength: 1, maxLength: 100 })
	@IsNotEmpty()
	@IsString()
	readonly pwd: string;

	@ApiProperty({ required: true, default: 'tester', minLength: 1, maxLength: 100 })
	@IsNotEmpty()
	@IsString()
	readonly name: string;
}

export class DUserSignin {
	@ApiProperty({ required: true, default: 'test@test.com', minLength: 1, maxLength: 100 })
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	readonly email: string;

	@ApiProperty({ required: true, default: 'pwd', minLength: 1, maxLength: 100 })
	@IsNotEmpty()
	@IsString()
	readonly pwd: string;
}

export class DUserUpdate {
	@ApiProperty({ required: false, maxLength: 100 })
	@IsString()
	@IsOptional()
	readonly pwd?: string;

	@ApiProperty({ required: false, maxLength: 100 })
	@IsString()
	@IsOptional()
	readonly name?: string;
}
