import { Injectable } from '@nestjs/common';
import { ResponsePayload } from './payload/common.payload';

@Injectable()
export class AppService {
	constructor() {}

	heartbeat(): ResponsePayload {
		return new ResponsePayload(true, null);
	}
}
