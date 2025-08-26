import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Correlation } from 'src/core/correlation/correlation.decorator';

@UseGuards(JwtAuthGuard)
@Controller('loans')
export class LoansController {
  constructor(private readonly service: LoansService) {}

  @Post()
  async submit(
    @Correlation() correlation_id: string,
    @GetUser() user: any,
    @Body() body: any,
  ) {
    return await this.service.submit(correlation_id, user.userId, body);
  }

  @Get('me')
  async mine(@Correlation() correlation_id: string, @GetUser() user: any) {
    return await this.service.listMine(correlation_id, user.userId);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('admin')
  async adminList(@Correlation() correlation_id: string) {
    return await this.service.adminList(correlation_id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id/status/:status')
  async updateStatus(
    @Correlation() correlation_id: string,
    @Param('id') id: string,
    @Param('status')
    status: 'submitted' | 'under_review' | 'approved' | 'rejected',
  ) {
    return await this.service.updateStatus(correlation_id, id, status);
  }
}
