import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ErrorPayload } from './payload/common.payload';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('/')
	@ApiOperation({ summary: 'heartbeat 체크' })
	heartbeat(): boolean {
		return this.appService.heartbeat();
	}
}
