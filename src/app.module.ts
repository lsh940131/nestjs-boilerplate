import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './domain/auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionFilter } from './filter/exception.filter';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './logger/logger.service';
import { LoggerInterceptor } from './logger/logger.interceptor';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule],
	controllers: [AppController],
	providers: [
		AppService,
		LoggerService,
		{
			provide: APP_FILTER,
			useClass: AllExceptionFilter,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggerInterceptor,
		},
	],
})
export class AppModule {}
