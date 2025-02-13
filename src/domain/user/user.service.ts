import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IUserUpdate } from './user.interface';
import { DUserUpdate } from './user.dto';
import { PUserSignin, PUserGet } from './user.payload';

@Injectable()
export class UserService {
	constructor(private prismaService: PrismaService) {}

	/**
	 * 회원가입
	 * - 이메일 중복 체크
	 * - 비밀번호 단방향 암호화
	 */
	async signup() {}

	/**
	 * 회원탈퇴
	 * - 삭제처리
	 */
	async signout() {}

	/**
	 * 로그인
	 * - 이메일 & 패스워드 확인
	 * - jwt 생성 & 저장
	 */
	async login() {}

	/**
	 * 로그아웃
	 * - 사용자id와 jwt 값으로 jwt 삭제처리
	 */
	async logout() {}

	/**
	 * 사용자 정보 조회
	 */
	async get(idx: number): Promise<PUserGet> {
		try {
			const user = await this.prismaService.user.findUnique({
				select: { email: true, name: true, createdAt: true, pwdUpdatedAt: true },
				where: { idx, deletedAt: null },
			});

			const result = new PUserGet(user);

			return result;
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 사용자 정보 수정
	 */
	async update(idx: number, data: DUserUpdate): Promise<boolean> {
		try {
			const { pwd, name } = data;

			const updateParam: IUserUpdate = { name };
			if (pwd) {
				// const hashPwd = this.utilService.createHash(pwd);
				// updateParam.pwd = hashPwd;
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
		} catch (e) {
			throw e;
		}
	}
}
