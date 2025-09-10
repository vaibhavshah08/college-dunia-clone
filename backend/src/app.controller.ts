import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Correlation } from 'src/core/correlation/correlation.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Correlation() correlation_id: string): Promise<string> {
    return await this.appService.getHello(correlation_id);
  }
}
