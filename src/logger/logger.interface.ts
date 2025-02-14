export interface ILogger {
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
