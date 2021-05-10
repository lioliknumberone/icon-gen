import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
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

	@Get("cache")
	getCache(): Array<string> {
		return this.appService.getCache();
	}

	@Post("icons")
	async icons(@Body() body): Promise<string[]> {
		
		if (body['size'] && body['time'] && body['duration']) {
			const size = Number(body['size']);
			const datetime = Moment(body['time'], 'HH:mm:ss');
			const duration =  Number(body['duration']);

			if (size != NaN && datetime.hour() != NaN && duration != NaN && (duration > 0 && duration <= 60)) {
				let icons = new Array<string>();
				let i = 0
				while(i < duration) {
					const icon = await this.appService.getIcon(size, datetime.hour(), datetime.minute(), datetime.second() + i);
					icons.push(icon);
					++i;
				}
				return icons;
			}
		}

		throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
	}
}
