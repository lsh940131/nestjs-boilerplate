import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { CryptoModule } from '../../crypto/crypto.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
	imports: [PrismaModule, CryptoModule, AuthModule],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
