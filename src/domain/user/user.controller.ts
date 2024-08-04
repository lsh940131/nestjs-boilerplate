import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseDto } from '../../dto/common.dto';
import { JwtGuard } from '../../guard/jwt.guard';
import { Auth } from '../../decorator/auth.decorator';
import { IAuth } from '../../interface/auth.interface';
import { UserUpdateDto } from '../../dto/user.dto';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async get(@Auth() auth: IAuth) {
		const userInfo = await this.userService.get(auth.idx);

		return userInfo;
	}

	@Put()
	async update(@Auth() auth: IAuth, @Body() data: UserUpdateDto) {
		return await this.userService.update(auth.idx, data);
	}
}
