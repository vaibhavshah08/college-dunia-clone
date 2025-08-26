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
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Correlation } from 'src/core/correlation/correlation.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @Get('course/:courseId')
  async listByCourse(@Correlation() correlation_id: string, @Param('courseId') courseId: string) {
    return await this.service.listPublicByCourse(correlation_id, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async submit(@Correlation() correlation_id: string, @GetUser() user: any, @Body() body: any) {
    return await this.service.submit(correlation_id, user.userId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  async adminList(@Correlation() correlation_id: string) {
    return await this.service.adminList(correlation_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/status/:status')
  async updateStatus(
    @Correlation() correlation_id: string,
    @Param('id') id: string,
    @Param('status') status: 'pending' | 'approved' | 'rejected',
  ) {
    return await this.service.updateStatus(correlation_id, id, status);
  }
}
