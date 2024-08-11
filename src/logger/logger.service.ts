import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ILogger } from '../interface/logger.interface';

@Injectable()
export class LoggerService {
	constructor(private prismaService: PrismaService) {}

	async create(data: ILogger) {
		try {
			const param = {
				ip: data.ip,
				method: data.method,
				url: data.url,
				headers: JSON.stringify(data.headers),
				body: JSON.stringify(data.body),
				query: JSON.stringify(data.query),
				statusCode: data.statusCode,
				responsePayload: JSON.stringify(data.responsePayload),
				error: JSON.stringify(data.error),
				userIdx: data.userIdx,
				token: data.token,
			};
			await this.prismaService.apiLog.create({ data: param });
		} catch (err) {}
	}
}
