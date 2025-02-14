import { ILogger } from './logger.interface';

export class DLogger {
	constructor(data: ILogger) {
		this.ip = data.ip;
		this.method = data.method;
		this.url = data.url;
		this.headers = data.headers;
		this.body = data.body;
		this.query = data.query;
		this.statusCode = data.statusCode;
		this.responsePayload = data.responsePayload;
		this.error = data.error;
		this.userIdx = data.userIdx;
		this.token = data.token;
	}

	readonly ip: string;
	readonly method: string;
	readonly url: string;
	readonly headers: any;
	readonly body: any | null;
	readonly query: any | null;
	readonly statusCode: number | null;
	readonly responsePayload: any | null;
	readonly error: any | null;
	readonly userIdx: number | null;
	readonly token: string | null;
}
