export interface ILogger {
	ip: string;
	method: string;
	url: string;
	headers: any;
	body: any | null;
	query: any | null;
	statusCode: number | null;
	responsePayload: any | null;
	error: any | null;
	userIdx: number | null;
	token: string | null;
}
