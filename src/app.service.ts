import { Injectable } from '@nestjs/common';
import * as config from './config.json';
const fs = require('fs');
const path = require('path');
const util = require('util')
const pureimage = require('pureimage');

@Injectable()
export class AppService {
	
	private dirName = 'tmp'
	private fullPath = path.resolve(path.join(config.staticRoot, this.dirName));
	private fsExists = util.promisify(fs.exists);

	constructor() {
		
		if (!fs.existsSync(this.fullPath)) {
			fs.mkdirSync(this.fullPath);
		}
		
	}

	async getIcon(size:number, hour:number, minute:number, second: number) : Promise<string> {

		const fileName = 'h' + hour + 'm' + minute + 's' + second + 'x' + size + '.png';
		const fullPath = path.join(this.fullPath, fileName);
		const url = path.join(this.dirName, fileName);

		const fileExists = await this.fsExists(fullPath);
		if (fileExists) {
			return url;
		}

		var img = pureimage.make(size, size);
		var ctx = img.getContext('2d');
		
		const period = 2 * Math.PI;
		const f0 = -Math.PI/2;
		const center = size/2;
		const inset = 0.14 * (size/2) 
		const radius = size/2 - inset;
		let len = radius - inset;
		const s =  (second / 60) * period + f0;
		const m = (minute / 60) * period + f0;
		let h = hour;
		while (h > 12) {
			h -= 12;
		}
		h = (h / 12) * period + f0;

		ctx.beginPath();
		ctx.arc(center, center, radius, 0, period, 0);
		ctx.moveTo(center, center);
		ctx.lineTo(center + len * Math.cos(s), center + len * Math.sin(s));
		len -= inset;
		ctx.moveTo(center, center);
		ctx.lineTo(center + len * Math.cos(m), center + len * Math.sin(m));
		len -= inset;
		ctx.moveTo(center, center);
		ctx.lineTo(center + len * Math.cos(h), center + len * Math.sin(h));
		ctx.stroke();

		return await pureimage.encodePNGToStream(img, fs.createWriteStream(fullPath)).then(() => {
			return url;
		}).catch((e)=> {
			console.log(e.message);
			return "";
		});
	}

	clear()  {
		
		let files = fs.readdirSync(this.fullPath);
		for (let i = 0; i < files.length; i++) {
			let p = path.join(this.fullPath, files[i]);
			fs.unlinkSync(p);
		}
	}

	getCache(): Array<string> {
		
		let contents = new Array<string>();

		let files = fs.readdirSync(this.fullPath);
		for (let i = 0; i < files.length; i++) {;
			const url = path.join(this.dirName, files[i]);
			contents.push(url)
		}
		
		return contents;
	}
}
