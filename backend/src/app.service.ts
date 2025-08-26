import { Injectable } from '@nestjs/common';
import { CustomLogger } from 'src/core/logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: CustomLogger) {}

  async getHello(correlation_id: string): Promise<string> {
    this.logger.setContext(this.constructor.name);
    this.logger.log(correlation_id, 'Hello World endpoint called');
    return 'Hello World!';
  }
}
