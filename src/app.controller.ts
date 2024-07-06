import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log(join(__dirname, '..', 'public'));
    return this.appService.getHello();
  }
}
