import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';
import { ResponsePayload } from './payload/common.payload';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('/')
	@ApiOperation({ summary: 'heartbeat 체크' })
	heartbeat(): ResponsePayload {
		return this.appService.heartbeat();
	}
}
