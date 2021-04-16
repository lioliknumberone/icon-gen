import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AppService } from './app.service';
const Moment = require('moment');

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get("icon")
	async getIcon(@Query() query:Object): Promise<string> {
		
		if (query['size'] && query['time']) {
			const size = Number(query['size']);
			const datetime = Moment(query['time'], 'HH:mm:ss');
			
			if (size != NaN && datetime.hour() != NaN) {
				return await this.appService.getIcon(size, datetime.hour(), datetime.minute(), datetime.second());
			}
		}

		throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
	}

	@Get("clear")
	clear()  {
		this.appService.clear(); 
	}
}
