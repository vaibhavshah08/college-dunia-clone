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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Correlation } from 'src/core/correlation/correlation.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get reviews by course ID' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'Reviews retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  })
  async listByCourse(
    @Correlation() correlation_id: string,
    @Param('courseId') courseId: string,
  ) {
    return await this.service.listPublicByCourse(correlation_id, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Submit a review' })
  @ApiBody({ description: 'Review data' })
  @ApiResponse({
    status: 201,
    description: 'Review submitted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async submit(
    @Correlation() correlation_id: string,
    @GetUser() user: any,
    @Body() body: any,
  ) {
    return await this.service.submit(correlation_id, user.userId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all reviews (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'All reviews retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async adminList(@Correlation() correlation_id: string) {
    return await this.service.adminList(correlation_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/status/:status')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update review status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiParam({
    name: 'status',
    description: 'New status',
    enum: ['pending', 'approved', 'rejected'],
  })
  @ApiResponse({
    status: 200,
    description: 'Review status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async updateStatus(
    @Correlation() correlation_id: string,
    @Param('id') id: string,
    @Param('status') status: 'pending' | 'approved' | 'rejected',
  ) {
    return await this.service.updateStatus(correlation_id, id, status);
  }
}
