import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from './dto/common.dto';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	heartbeat() {
		return this.appService.heartbeat();
	}

	@Get('response/form')
	response() {
		return true;
	}
}
