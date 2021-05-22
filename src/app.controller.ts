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
	async icons(@Query() query:Object, @Body() body): Promise<string[]> {

		let sizeValue = body['size'] ?? query['size']
		let timeValue =  body['time'] ?? query['time']
		let durationValue = body['duration'] ?? query['duration']
		
		if (sizeValue && timeValue && durationValue) {
			const size = Number(sizeValue);
			const datetime = Moment(timeValue, 'HH:mm:ss');
			const duration =  Number(durationValue);

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

	@Get("app")
	getInfo() {
		
		let info:any = {};
		info.name = "icon-gen";
		info.date = new Date();
		info.cache = this.appService.getCache();

		return info;
	}
}
