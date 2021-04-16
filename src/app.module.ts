import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import * as config from './config.json';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: path.resolve(config.staticRoot),
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
