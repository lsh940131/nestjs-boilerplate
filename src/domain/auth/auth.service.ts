import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { CryptoService } from '../../crypto/crypto.service';
import { IAuth, IAuthUpdate } from './auth.interface';
import { CreateJwtDto, SignUpDto, SignInDto, AuthUpdateDto } from './auth.dto';
import { AuthGetPayload, AuthSigninPayload } from './auth.payload';
import { ErrorCodeEnum } from '../../common/enum/errorCode.enum';
import { ErrorPayload } from '../../common/payload/error.payload';

@Injectable()
export class AuthService {
	constructor(
		private prismaService: PrismaService,
		private jwtService: JwtService,
		private utilService: CryptoService,
	) {}

	/**
	 * 사용자id로 jwt 토큰 생성
	 * @param idx 사용자id
	 * @returns jwt
	 */
	async createJwt(data: CreateJwtDto): Promise<string> {
		try {
			const encrypted = this.utilService.aes256Encrypt(
				JSON.stringify({
					...data,
				}),
			);
			return await this.jwtService.signAsync({ sub: encrypted });
		} catch (e) {
			throw e;
		}
	}

	/**
	 * jwt 유효성 체크
	 * - decrypt
	 * - jwt 저장 유무 체크
	 * - 사용자 체크
	 * @param sub aes256으로 암호화된 sub 데이터
	 * @param jwt 토큰
	 * @returns 사용자 정보
	 */
	async validateJwt(sub: string, jwt: string): Promise<IAuth> {
		try {
			let auth: IAuth;
			// aes decrypt
			try {
				const decryptInfo = this.utilService.aes256Decrypt(sub);
				auth = JSON.parse(decryptInfo) as IAuth;
			} catch (e) {
				throw new ErrorPayload({ statusCode: 401, message: 'Unauthorized' });
			}

			// check the token is saved in db
			jwt = jwt.replace('Bearer ', '');
			auth.jwt = jwt;
			const tokenInfo = await this.prismaService.userToken.findFirst({
				select: {
					idx: true,
					userIdx: true,
				},
				where: {
					value: jwt,
					deletedAt: null,
				},
			});
			if (!tokenInfo || tokenInfo.userIdx != auth.idx) {
				throw new ErrorPayload({ statusCode: 401, message: 'Unauthorized' });
			}

			const userInfo = await this.prismaService.user.findUnique({ select: { idx: true }, where: { idx: auth.idx, deletedAt: null } });
			if (!userInfo) {
				throw new ErrorPayload({ statusCode: 401, message: 'Unauthorized' });
			}

			return auth;
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 회원가입
	 * - 이메일 중복 체크
	 * - 비밀번호 단방향 암호화
	 */
	async signUp(data: SignUpDto): Promise<boolean> {
		try {
			const { email, pwd, name } = data;

			const [isDupEmail] = await this.prismaService.user.findMany({ where: { email, deletedAt: null } });
			if (isDupEmail) {
				throw new ErrorPayload({ statusCode: 409, message: 'Already use the email', code: ErrorCodeEnum.SIGNUP_DUP_EMAIL });
			}

			const hashPwd = this.utilService.createHash(pwd);

			// 사용자 생성
			await this.prismaService.user.create({ data: { email, pwd: hashPwd, name } });

			return true;
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 로그인
	 * - 이메일 & 패스워드 확인
	 * - jwt 생성 & 저장
	 */
	async signIn(data: SignInDto): Promise<AuthSigninPayload> {
		try {
			const { email, pwd } = data;

			const [userInfo] = await this.prismaService.user.findMany({ where: { email, deletedAt: null } });
			if (!userInfo) {
				throw new ErrorPayload({ statusCode: 401, message: 'Incorrect email or password' });
			}

			const isValid = this.utilService.validateHash(userInfo.pwd, pwd);
			if (!isValid) {
				throw new ErrorPayload({ statusCode: 401, message: 'Incorrect email or password' });
			}

			// jwt 생성
			const token = await this.createJwt({ idx: userInfo.idx });

			// jwt 저장
			await this.prismaService.userToken.create({ data: { userIdx: userInfo.idx, value: token } });

			const result = new AuthSigninPayload({
				token,
				pwdUpdatedAt: userInfo.pwdUpdatedAt,
			});

			return result;
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 로그아웃
	 * - 사용자id와 jwt 값으로 jwt 삭제처리
	 */
	async signOut(auth: IAuth): Promise<boolean> {
		try {
			await this.prismaService.userToken.updateMany({ where: { userIdx: auth.idx, value: auth.jwt }, data: { deletedAt: new Date() } });

			return true;
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 회원탈퇴
	 * - 삭제처리
	 */
	async resign(idx: number): Promise<boolean> {
		try {
			await this.prismaService.$transaction(async (tx) => {
				await tx.userToken.updateMany({ where: { userIdx: idx, deletedAt: null }, data: { deletedAt: new Date() } });

				await tx.user.update({ where: { idx }, data: { deletedAt: new Date() } });
			});

			return true;
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 사용자 정보 조회
	 */
	async get(idx: number): Promise<AuthGetPayload> {
		try {
			const user = await this.prismaService.user.findUnique({
				select: { email: true, name: true, createdAt: true, pwdUpdatedAt: true },
				where: { idx, deletedAt: null },
			});

			const result = new AuthGetPayload(user);

			return result;
		} catch (e) {
			throw e;
		}
	}

	/**
	 * 사용자 정보 수정
	 */
	async update(idx: number, data: AuthUpdateDto): Promise<boolean> {
		try {
			const { pwd, name } = data;

			const updateParam: IAuthUpdate = { name };
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
		} catch (e) {
			throw e;
		}
	}
}
