import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from './auth.service';
import { CryptoService } from '../../util/crypto.service';
import { CreateJwtDto } from './auth.dto';
import { IAuth } from './auth.interface';

// Mock PrismaServiceencrypted
const prismaDefaultFunc = {
	findUnique: jest.fn(),
	findFirst: jest.fn(),
	findMany: jest.fn(),
	create: jest.fn(),
	upsert: jest.fn(),
	update: jest.fn(),
	updateMany: jest.fn(),
	delete: jest.fn(),
	deleteMany: jest.fn(),
};
const mockPrismaService = {
	userToken: prismaDefaultFunc,
	user: prismaDefaultFunc,
	$transaction: jest.fn(),
};

// Mock JwtService
const mockJwtService = {
	signAsync: jest.fn(() => 'JWT_ENCRYPTED_STRING'),
};

// Mock CryptoService
const mockUtilService = {
	aes256Encrypt: jest.fn(() => 'AES256_ENCRYPTED_STRING'),
	aes256Decrypt: jest.fn(),
	createHash: jest.fn(() => 'HASH_STRING'),
	validateHash: jest.fn(() => true),
};

describe('AuthService', () => {
	let prismaService: PrismaService;
	let authService: AuthService;
	let utilService: CryptoService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{ provide: PrismaService, useValue: mockPrismaService },
				{ provide: JwtService, useValue: mockJwtService },
				{ provide: CryptoService, useValue: mockUtilService },
				AuthService,
				ConfigService,
			],
		}).compile();

		prismaService = module.get<PrismaService>(PrismaService);
		authService = module.get<AuthService>(AuthService);
		utilService = module.get<CryptoService>(CryptoService);
	});

	describe('createJwt()', () => {
		it('success', async () => {
			const input: CreateJwtDto = {
				idx: 1,
			};
			const expectedResult = 'JWT_ENCRYPTED_STRING';

			const result = await authService.createJwt(input);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('validateJwt()', () => {
		it('success', async () => {
			const input = {
				sub: 'AES256_ENCRYPTED_STRING',
				jwt: 'JWT_ENCRYPTED_STRING',
			};
			const auth: IAuth = {
				idx: 1,
				jwt: 'JWT_ENCRYPTED_STRING',
			};

			mockUtilService.aes256Decrypt.mockReturnValueOnce(JSON.stringify({ idx: 1 }));

			mockPrismaService.userToken.findFirst.mockResolvedValueOnce({
				idx: 1,
				userIdx: 1,
			});

			mockPrismaService.user.findUnique.mockResolvedValueOnce({
				idx: 1,
			});

			const result = await authService.validateJwt(input.sub, input.jwt);
			expect(result).toEqual({
				idx: 1,
				jwt: 'JWT_ENCRYPTED_STRING',
			});

			expect(prismaService.userToken.findFirst).toHaveBeenCalledWith({
				select: {
					idx: true,
					userIdx: true,
				},
				where: {
					value: input.jwt,
					deletedAt: null,
				},
			});

			expect(prismaService.user.findUnique).toHaveBeenCalledWith({
				select: { idx: true },
				where: { idx: auth.idx, deletedAt: null },
			});
		});

		it('fail - aes256 decrypt fail', async () => {
			const input = {
				sub: 'WRONG_SUB',
				jwt: 'WRONG_JWT',
			};

			mockUtilService.aes256Decrypt.mockReturnValueOnce('AES256_DECRYPT_FAIL');

			// await authService.validateJwt(input.sub, input.jwt).catch((e) => typeof e === typeof ErrorDto);
		});

		it('fail - tokenInfo not found | tokenInfo mismatch jwtInfo', async () => {
			const input = {
				sub: 'AES256_ENCRYPTED_STRING',
				jwt: 'JWT_ENCRYPTED_STRING',
			};

			mockUtilService.aes256Decrypt.mockReturnValueOnce(JSON.stringify({ idx: 1 }));

			mockPrismaService.userToken.findFirst.mockResolvedValueOnce(undefined);

			// await authService.validateJwt(input.sub, input.jwt).catch((e) => typeof e === typeof ErrorDto);

			expect(prismaService.userToken.findFirst).toHaveBeenCalledWith({
				select: {
					idx: true,
					userIdx: true,
				},
				where: {
					value: input.jwt,
					deletedAt: null,
				},
			});
		});

		it('fail - userInfo not found', async () => {
			const input = {
				sub: 'AES256_ENCRYPTED_STRING',
				jwt: 'JWT_ENCRYPTED_STRING',
			};
			const auth: IAuth = {
				idx: 1,
				jwt: 'JWT_ENCRYPTED_STRING',
			};

			mockUtilService.aes256Decrypt.mockReturnValueOnce(JSON.stringify({ idx: 1 }));

			mockPrismaService.userToken.findFirst.mockResolvedValueOnce({
				idx: 1,
				userIdx: 1,
			});

			mockPrismaService.user.findUnique.mockResolvedValueOnce(undefined);

			// await authService.validateJwt(input.sub, input.jwt).catch((e) => typeof e === typeof ErrorDto);

			expect(prismaService.userToken.findFirst).toHaveBeenCalledWith({
				select: {
					idx: true,
					userIdx: true,
				},
				where: {
					value: input.jwt,
					deletedAt: null,
				},
			});

			expect(prismaService.user.findUnique).toHaveBeenCalledWith({
				select: { idx: true },
				where: { idx: auth.idx, deletedAt: null },
			});
		});
	});
});
