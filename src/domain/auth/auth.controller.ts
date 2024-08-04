import { Controller, UseGuards, Post, Get, Put, Delete, Query, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtGuard } from '../../guard/jwt.guard';
import { Auth } from '../../decorator/auth.decorator';
import { IAuth } from '../../interface/auth.interface';
import { SignUpDto, SignInDto, AuthUpdateDto } from '../../dto/auth.dto';
import { AuthSigninPayload, AuthGetPayload, AuthSignupEmailDupPayload, AuthSigninFailPayload } from '../../payload/auth.payload';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/signup')
	@ApiOperation({ summary: '회원가입' })
	@ApiResponse({
		status: 409,
		description: '이메일 중복',
		type: AuthSignupEmailDupPayload,
	})
	async signUp(@Body() data: SignUpDto): Promise<boolean> {
		return await this.authService.signUp(data);
	}

	@Post('/signin')
	@ApiOperation({ summary: '로그인' })
	@ApiResponse({
		status: 401,
		description: '이메일 또는 패스워드 틀림',
		type: AuthSigninFailPayload,
	})
	async signIn(@Body() data: SignInDto): Promise<AuthSigninPayload> {
		return await this.authService.signIn(data);
	}

	@ApiBearerAuth('access-token')
	@UseGuards(JwtGuard)
	@Post('/signout')
	@ApiOperation({ summary: '로그아웃' })
	async signOut(@Auth() auth: IAuth): Promise<boolean> {
		return await this.authService.signOut(auth);
	}

	@ApiBearerAuth('access-token')
	@UseGuards(JwtGuard)
	@Delete('/resign')
	@ApiOperation({ summary: '회원탈퇴' })
	async resign(@Auth() auth: IAuth): Promise<boolean> {
		return await this.authService.resign(auth.idx);
	}

	@ApiBearerAuth('access-token')
	@UseGuards(JwtGuard)
	@Get('/')
	@ApiOperation({ summary: '사용자 정보 조회' })
	async get(@Auth() auth: IAuth): Promise<AuthGetPayload> {
		return await this.authService.get(auth.idx);
	}

	@ApiBearerAuth('access-token')
	@UseGuards(JwtGuard)
	@Put('/')
	@ApiOperation({ summary: '사용자 정보 수정' })
	async update(@Auth() auth: IAuth, @Body() data: AuthUpdateDto): Promise<boolean> {
		return await this.authService.update(auth.idx, data);
	}
}
