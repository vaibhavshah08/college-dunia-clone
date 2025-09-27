import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Put,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Correlation } from 'src/core/correlation/correlation.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly user_service: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            user_id: { type: 'string' },
            email: { type: 'string' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 409,
    description: 'User email already exists',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User email already exists' },
        statusCode: { type: 'number', example: 409 },
      },
    },
  })
  async signup(
    @Correlation() correlation_id: string,
    @Body() create_user_dto: CreateUserDto,
  ) {
    return await this.user_service.signup(correlation_id, create_user_dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                user_id: { type: 'string' },
                email: { type: 'string' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                is_admin: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - Invalid credentials, user inactive, or user does not exist',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          enum: [
            'Invalid credentials',
            'User is Inactive',
            'User doesnot exist',
          ],
          example: 'User is Inactive',
        },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  async login(
    @Correlation() correlation_id: string,
    @Body() login_user_dto: LoginUserDto,
  ) {
    return await this.user_service.login(correlation_id, login_user_dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            user_id: { type: 'string' },
            email: { type: 'string' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            is_admin: { type: 'boolean' },
            google_id: { type: 'string' },
            avatar_url: { type: 'string' },
            email_verified: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@Correlation() correlation_id: string, @GetUser() user: any) {
    return await this.user_service.findById(correlation_id, user.user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(
    @Correlation() correlation_id: string,
    @Param('id') id: string,
  ) {
    return await this.user_service.findById(correlation_id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-document')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Upload user document' })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  @ApiResponse({ status: 400, description: 'No file uploaded' })
  async uploadDocument(
    @Correlation() correlation_id: string,
    @GetUser() user: any,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // In a real application, you would save the file to a storage service
    // and get the document path. For now, we'll use a placeholder
    const document_path = `/uploads/${file.filename}`;
    return await this.user_service.uploadDocument(
      correlation_id,
      user.user_id,
      document_path,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('documents')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user documents' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  async getUserDocuments(
    @Correlation() correlation_id: string,
    @GetUser() user: any,
  ) {
    return await this.user_service.getUserDocuments(
      correlation_id,
      user.user_id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateUserDto })
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
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only update own profile',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Correlation() correlation_id: string,
    @Param('id') user_id: string,
    @Body() update_user_dto: UpdateUserDto,
    @GetUser() current_user: any,
  ) {
    return await this.user_service.updateUser(
      correlation_id,
      user_id,
      update_user_dto,
      current_user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
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
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(
    @Correlation() correlation_id: string,
    @Param('id') user_id: string,
    @GetUser() current_user: any,
  ) {
    return await this.user_service.deleteUser(
      correlation_id,
      user_id,
      current_user,
    );
  }
}
