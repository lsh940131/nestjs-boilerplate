import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../common/strategy/jwt.strategy';
import { CryptoModule } from '../../crypto/crypto.module';

@Module({
	controllers: [],
	providers: [AuthService, JwtStrategy],
	imports: [
		PrismaModule,
		ConfigModule,
		CryptoModule,
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
