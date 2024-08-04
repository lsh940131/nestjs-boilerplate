import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResponseDto } from '../../dto/common.dto';
import { JwtGuard } from '../../guard/jwt.guard';
import { Auth } from '../../decorator/auth.decorator';
import { IAuth } from '../../interface/auth.interface';
import { SignUpDto, SignInDto } from '../../dto/auth.dto';

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
}
