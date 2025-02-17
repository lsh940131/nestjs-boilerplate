import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IUserUpdate } from './user.interface';
import { DUserSignin, DUserSignup, DUserUpdate } from './user.dto';
import { PUserSignin, PUserGet } from './user.payload';
import { ErrorPayload } from '../../common/payload/error.payload';
import { CryptoService } from '../../crypto/crypto.service';
import { AuthService } from '../../auth/auth.service';
import { ErrorCodeEnum } from '../../common/enum/errorCode.enum';

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly cryptoService: CryptoService,
		private readonly authService: AuthService,
	) {}

	/**
	 * 회원가입
	 * - 이메일 중복 체크
	 * - 비밀번호 단방향 암호화
	 */
	async signup(data: DUserSignup) {
		const { email, pwd, name } = data;

		const [isDupEmail] = await this.prismaService.user.findMany({ where: { email, deletedAt: null } });
		if (isDupEmail) {
			throw new ErrorPayload('Already use the email', ErrorCodeEnum.SIGNUP_DUP_EMAIL);
		}

		const hashPwd = this.cryptoService.createHash(pwd);

		// 사용자 생성
		await this.prismaService.user.create({ data: { email, pwd: hashPwd, name } });

		return true;
	}

	/**
	 * 회원탈퇴
	 * - 삭제처리
	 */
	async signout(idx: number): Promise<boolean> {
		await this.prismaService.$transaction(async (tx) => {
			await tx.userToken.updateMany({ where: { userIdx: idx, deletedAt: null }, data: { deletedAt: new Date() } });

			await tx.user.update({ where: { idx }, data: { deletedAt: new Date() } });
		});

		return true;
	}

	/**
	 * 로그인
	 * - 이메일 & 패스워드 확인
	 * - jwt 생성 & 저장
	 */
	async login(data: DUserSignin): Promise<PUserSignin> {
		const { email, pwd } = data;

		const [userInfo] = await this.prismaService.user.findMany({ where: { email, deletedAt: null } });
		if (!userInfo) {
			throw new ErrorPayload('Incorrect email or password');
		}

		const isValid = this.cryptoService.validateHash(userInfo.pwd, pwd);
		if (!isValid) {
			throw new ErrorPayload('Incorrect email or password');
		}

		// jwt 생성
		const token = await this.authService.createJwt({ idx: userInfo.idx });

		// jwt 저장
		await this.prismaService.userToken.create({ data: { userIdx: userInfo.idx, value: token } });

		const result = new PUserSignin({
			token,
			pwdUpdatedAt: userInfo.pwdUpdatedAt,
		});

		return result;
	}

	/**
	 * 로그아웃
	 * - 사용자id와 jwt 값으로 jwt 삭제처리
	 */
	async logout(idx: number, jwt: string): Promise<boolean> {
		await this.prismaService.userToken.updateMany({ where: { userIdx: idx, value: jwt }, data: { deletedAt: new Date() } });

		return true;
	}

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
				const hashPwd = this.cryptoService.createHash(pwd);
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
		} catch (e) {
			throw e;
		}
	}
}
