import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtGuard } from '../../guard/jwt.guard';
import { Auth } from '../../decorator/auth.decorator';
import { IAuth } from '../../interface/auth.interface';
import { SignUpDto, SignInDto, AuthUpdateDto } from '../../dto/auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/signup')
	async signUp(@Body() data: SignUpDto) {
		return await this.authService.signUp(data);
	}

	@Post('/signin')
	async signIn(@Body() data: SignInDto) {
		const result = await this.authService.signIn(data);

		return { token: result };
	}

	@ApiBearerAuth('access-token')
	@UseGuards(JwtGuard)
	@Post('/signout')
	async signOut(@Auth() auth: IAuth) {
		return await this.authService.signOut(auth);
	}

	@ApiBearerAuth('access-token')
	@UseGuards(JwtGuard)
	@Delete('/resign')
	async resign(@Auth() auth: IAuth) {
		return await this.authService.resign(auth.idx);
	}

	@ApiBearerAuth('access-token')
	@UseGuards(JwtGuard)
	@Get('/')
	async get(@Auth() auth: IAuth) {
		const userInfo = await this.authService.get(auth.idx);

		return userInfo;
	}

	@ApiBearerAuth('access-token')
	@UseGuards(JwtGuard)
	@Put('/')
	async update(@Auth() auth: IAuth, @Body() data: AuthUpdateDto) {
		return await this.authService.update(auth.idx, data);
	}
}
