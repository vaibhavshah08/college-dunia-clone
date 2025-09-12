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
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Correlation } from 'src/core/correlation/correlation.decorator';

@ApiTags('Loans')
@Controller('loans')
export class LoansController {
  constructor(private readonly service: LoansService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Submit loan application' })
  @ApiBody({ type: CreateLoanDto })
  @ApiResponse({
    status: 201,
    description: 'Loan application submitted successfully',
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
    @Body() body: CreateLoanDto,
  ) {
    return await this.service.submit(correlation_id, user.user_id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: "Get user's loan applications" })
  @ApiResponse({
    status: 200,
    description: 'Loan applications retrieved successfully',
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async mine(@Correlation() correlation_id: string, @GetUser() user: any) {
    return await this.service.listMine(correlation_id, user.user_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all loan applications (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'All loan applications retrieved successfully',
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
  @Get('college/:collegeId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get loans by college ID (Admin only)' })
  @ApiParam({ name: 'collegeId', description: 'College ID' })
  @ApiResponse({
    status: 200,
    description: 'Loans retrieved successfully',
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
  async getByCollegeId(
    @Correlation() correlation_id: string,
    @Param('collegeId') collegeId: string,
  ) {
    return await this.service.getByCollegeId(correlation_id, collegeId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get loan application by ID' })
  @ApiParam({ name: 'id', description: 'Loan ID' })
  @ApiResponse({
    status: 200,
    description: 'Loan application retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Loan not found' })
  async findById(
    @Correlation() correlation_id: string,
    @Param('id') id: string,
  ) {
    return await this.service.findById(correlation_id, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/status/:status')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update loan application status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Loan ID' })
  @ApiParam({
    name: 'status',
    description: 'New status',
    enum: ['submitted', 'under_review', 'approved', 'rejected'],
  })
  @ApiResponse({ status: 200, description: 'Loan status updated successfully' })
  @ApiResponse({ status: 404, description: 'Loan not found' })
  async updateStatus(
    @Correlation() correlation_id: string,
    @Param('id') id: string,
    @Param('status')
    status: 'submitted' | 'under_review' | 'approved' | 'rejected',
  ) {
    return await this.service.updateStatus(correlation_id, id, status);
  }
}
