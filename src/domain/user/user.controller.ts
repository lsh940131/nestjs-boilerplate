import { Controller, UseGuards, Post, Get, Put, Delete, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { DUserSignin, DUserSignup, DUserUpdate } from './user.dto';
import { PUserGet, PUserSignin } from './user.payload';
import { Auth } from '../../auth/auth.decorator';
import { DAuth } from '../../auth/auth.dto';
import { JwtGuard } from '../../auth/jwt/jwt.guard';

@Controller('user')
@ApiTags('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/signup')
	@ApiOperation({ summary: '회원가입' })
	async signup(@Body() data: DUserSignup): Promise<boolean> {
		return await this.userService.signup(data);
	}

	@ApiBearerAuth('access-token')
	@UseGuards(JwtGuard)
	@Delete('/signout')
	@ApiOperation({ summary: '회원탈퇴' })
	async signout(@Auth() auth: DAuth): Promise<boolean> {
		return await this.userService.signout(auth.idx);
	}

	@Post('/login')
	@ApiOperation({ summary: '로그인' })
	async login(@Body() data: DUserSignin): Promise<PUserSignin> {
		return await this.userService.login(data);
	}

	@ApiBearerAuth('access-token')
	@UseGuards(JwtGuard)
	@Post('/logout')
	@ApiOperation({ summary: '로그아웃' })
	async logout(@Auth() auth: DAuth): Promise<boolean> {
		return await this.userService.logout(auth.idx, auth.jwt);
	}

	@ApiBearerAuth('access-token')
	@UseGuards(JwtGuard)
	@Get('/')
	@ApiOperation({ summary: '사용자 정보 조회' })
	async get(@Auth() auth: DAuth): Promise<PUserGet> {
		return await this.userService.get(auth.idx);
	}

	@ApiBearerAuth('access-token')
	@UseGuards(JwtGuard)
	@Put('/')
	@ApiOperation({ summary: '사용자 정보 수정' })
	async update(@Auth() auth: DAuth, @Body() data: DUserUpdate): Promise<boolean> {
		return await this.userService.update(auth.idx, data);
	}
}
