import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { IAuth } from './auth.interface';
import { DAuth, DAuthCreateJwt } from './auth.dto';
import { ErrorPayload } from '../common/payload/error.payload';

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
	async createJwt(data: DAuthCreateJwt): Promise<string> {
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
	async validateJwt(sub: string, jwt: string): Promise<DAuth> {
		try {
			let auth: IAuth;
			// aes decrypt
			try {
				const decryptInfo = this.utilService.aes256Decrypt(sub);
				auth = JSON.parse(decryptInfo) as IAuth;
			} catch (e) {
				throw new ErrorPayload('Unauthorized');
			}

			// check the token is saved in db
			jwt = jwt.replace('Bearer ', '');
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
				throw new ErrorPayload('Unauthorized');
			}

			const userInfo = await this.prismaService.user.findUnique({ select: { idx: true }, where: { idx: auth.idx, deletedAt: null } });
			if (!userInfo) {
				throw new ErrorPayload('Unauthorized');
			}

			return new DAuth(auth.idx, jwt);
		} catch (e) {
			throw e;
		}
	}
}
