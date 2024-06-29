import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UtilService } from '../../util/util.service';
import { UserUpdateDto } from '../../dto/user.dto';
import { IUserUpdate } from '../../interface/user.interface';

@Injectable()
export class UserService {
	constructor(
		private prismaService: PrismaService,
		private utilService: UtilService,
	) {}

	/**
	 * 사용자 정보 조회
	 */
	async get(idx: number) {
		const userInfo = await this.prismaService.user.findUnique({
			select: { email: true, name: true, createdAt: true, pwdUpdatedAt: true },
			where: { idx, deletedAt: null },
		});

		return userInfo;
	}

	/**
	 * 사용자 정보 수정
	 */
	async update(idx: number, data: UserUpdateDto): Promise<Boolean> {
		const { pwd, name } = data;

		const updateParam: IUserUpdate = { name };
		if (pwd) {
			const hashPwd = this.utilService.createHash(pwd);
			updateParam.pwd = hashPwd;
		}

		for (const key in updateParam) {
			if (updateParam[key] == null) {
				delete updateParam[key];
			}
		}

		if (Object.keys(updateParam).length) {
			await this.prismaService.user.update({ where: { idx }, data: updateParam });
		}

		return true;
	}
}
