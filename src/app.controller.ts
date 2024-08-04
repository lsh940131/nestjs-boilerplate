import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('/')
	@ApiOperation({ summary: 'heartbeat 체크' })
	heartbeat() {
		return this.appService.heartbeat();
	}
}
