import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Correlation } from 'src/core/correlation/correlation.decorator';
import { AdminUpdateUserDto } from '../user/dto/admin-update-user.dto';
import { AdminCreateUserDto } from '../user/dto/admin-create-user.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            totalUsers: { type: 'number' },
            totalColleges: { type: 'number' },
            totalLoans: { type: 'number' },
            totalDocuments: { type: 'number' },
            pendingLoans: { type: 'number' },
            partneredColleges: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getDashboardStats(@Correlation() correlation_id: string) {
    return await this.adminService.getDashboardStats(correlation_id);
  }

  @Post('users')
  @ApiOperation({ summary: 'Create new user (Admin only)' })
  @ApiBody({ type: AdminCreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            user_id: { type: 'string' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            email: { type: 'string' },
            phone_number: { type: 'string' },
            is_admin: { type: 'boolean' },
            is_active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async createUser(
    @Correlation() correlation_id: string,
    @Body() create_user_dto: AdminCreateUserDto,
    @GetUser() current_user: any,
  ) {
    return await this.adminService.createUser(
      correlation_id,
      create_user_dto,
      current_user,
    );
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users with pagination and search' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            users: { type: 'array', items: { type: 'object' } },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
          },
        },
      },
    },
  })
  async getAllUsers(
    @Correlation() correlation_id: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('search') search?: string,
  ) {
    return await this.adminService.getAllUsers(
      correlation_id,
      page,
      limit,
      search,
    );
  }

  @Get('documents')
  @ApiOperation({
    summary: 'Get all documents with pagination and filters',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Document status filter',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'User ID filter',
  })
  @ApiQuery({
    name: 'loanId',
    required: false,
    type: String,
    description: 'Loan ID filter',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date filter (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date filter (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for documents',
  })
  @ApiResponse({
    status: 200,
    description: 'Documents retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            documents: { type: 'array', items: { type: 'object' } },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
          },
        },
      },
    },
  })
  async getAllDocuments(
    @Correlation() correlation_id: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('status') status?: string,
    @Query('userId') userId?: string,
    @Query('loanId') loanId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('search') search?: string,
  ) {
    return await this.adminService.getAllDocuments(
      correlation_id,
      page,
      limit,
      status,
      userId,
      loanId,
      startDate,
      endDate,
      search,
    );
  }

  @Get('loans')
  @ApiOperation({
    summary: 'Get all loans with pagination and filters',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Loan status filter',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'User ID filter',
  })
  @ApiQuery({
    name: 'collegeId',
    required: false,
    type: String,
    description: 'College ID filter',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date filter (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date filter (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Loans retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            loans: { type: 'array', items: { type: 'object' } },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
          },
        },
      },
    },
  })
  async getAllLoans(
    @Correlation() correlation_id: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('status') status?: string,
    @Query('userId') userId?: string,
    @Query('collegeId') collegeId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.adminService.getAllLoans(
      correlation_id,
      page,
      limit,
      status,
      userId,
      collegeId,
      startDate,
      endDate,
    );
  }

  @Put('documents/:id/status')
  @ApiOperation({ summary: 'Update document status (approve/reject)' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({
    status: 200,
    description: 'Document status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async updateDocumentStatus(
    @Correlation() correlation_id: string,
    @Param('id') documentId: string,
    @Body('status') status: string,
  ) {
    return await this.adminService.updateDocumentStatus(
      correlation_id,
      documentId,
      status,
    );
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Update any user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: AdminUpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            user_id: { type: 'string' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            email: { type: 'string' },
            phone_number: { type: 'string' },
            is_admin: { type: 'boolean' },
            is_active: { type: 'boolean' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Correlation() correlation_id: string,
    @Param('id') user_id: string,
    @Body() update_user_dto: AdminUpdateUserDto,
    @GetUser() current_user: any,
  ) {
    return await this.adminService.updateUser(
      correlation_id,
      user_id,
      update_user_dto,
      current_user,
    );
  }

  @Get('users/:id/dependencies')
  @ApiOperation({ summary: 'Check user dependencies (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User dependencies checked successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            loans: { type: 'number' },
            documents: { type: 'number' },
            reviews: { type: 'number' },
            hasDependencies: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async checkUserDependencies(
    @Correlation() correlation_id: string,
    @Param('id') user_id: string,
  ) {
    return await this.adminService.checkUserDependencies(
      correlation_id,
      user_id,
    );
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiQuery({
    name: 'mode',
    required: false,
    enum: ['USER_ONLY', 'WITH_DEPENDENCIES'],
    description: 'Deletion mode',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            user_id: { type: 'string' },
            mode: { type: 'string' },
            deletedCounts: {
              type: 'object',
              properties: {
                loans: { type: 'number' },
                documents: { type: 'number' },
                reviews: { type: 'number' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'User has dependencies' })
  async deleteUser(
    @Correlation() correlation_id: string,
    @Param('id') user_id: string,
    @GetUser() current_user: any,
    @Query('mode') mode: 'USER_ONLY' | 'WITH_DEPENDENCIES' = 'USER_ONLY',
  ) {
    return await this.adminService.deleteUser(
      correlation_id,
      user_id,
      current_user,
      mode,
    );
  }

  @Post('documents/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload document for a user (Admin only)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
        },
        purpose: {
          type: 'string',
        },
        document_type: {
          type: 'string',
        },
        user_id: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded successfully',
  })
  async uploadDocumentForUser(
    @Correlation() correlation_id: string,
    @GetUser() current_user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
    @Body('purpose') purpose: string,
    @Body('document_type') document_type: string,
    @Body('user_id') user_id: string,
    @Body('description') description?: string,
  ) {
    return await this.adminService.uploadDocumentForUser(
      correlation_id,
      current_user,
      file,
      name,
      purpose,
      document_type,
      user_id,
      description,
    );
  }
}
