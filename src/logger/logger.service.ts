import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LoggerService {
	constructor(private prismaService: PrismaService) {}

	async create(
		userIdx: number,
		ip: string,
		url: string,
		method: string,
		headers: any,
		bodys: any | null,
		query: any | null,
		responseData: any | null,
		error: any | null,
		status: number,
	) {
		try {
			await this.prismaService.apiLog.create({
				data: {
					userIdx,
					ip,
					url,
					method,
					headers: JSON.stringify(headers),
					bodys: JSON.stringify(bodys),
					query: JSON.stringify(query),
					responseData: JSON.stringify(responseData),
					error: JSON.stringify(error),
					status,
				},
			});
		} catch (err) {
			throw err;
		}
	}
}
