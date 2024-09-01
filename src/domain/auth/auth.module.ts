import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CryptoService } from '../../crypto/crypto.service';
import { JwtStrategy } from '../../common/strategy/jwt.strategy';

@Module({
	controllers: [AuthController],
	providers: [AuthService, CryptoService, JwtStrategy],
	imports: [
		PrismaModule,
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWTKEY'),
				signOptions: {
					expiresIn: '1d',
				},
			}),
		}),
	],
	exports: [AuthService],
})
export class AuthModule {}
