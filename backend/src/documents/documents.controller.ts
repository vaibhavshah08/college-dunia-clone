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
  UploadedFile,
  UseInterceptors,
  Res,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../auth/get-user.decorator';
import { Correlation } from 'src/core/correlation/correlation.decorator';
import type { DocumentStatus } from '../user/documents.entity';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('JWT-auth')
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
          description: 'Document name (required)',
        },
        purpose: {
          type: 'string',
          description: 'Document purpose (required)',
        },
        type: {
          type: 'string',
          enum: ['ID_PROOF', 'ADDRESS_PROOF', 'MARKSHEET', 'PHOTO', 'OTHER'],
          description: 'Document type (required)',
        },
        document_type: {
          type: 'string',
          description: 'Legacy document type (optional)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload document' })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file or file too large' })
  async uploadDocument(
    @Correlation() correlation_id: string,
    @GetUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
    @Body('purpose') purpose: string,
    @Body('type') type: string,
    @Body('document_type') document_type?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!name) {
      throw new BadRequestException('Document name is required');
    }
    if (!purpose) {
      throw new BadRequestException('Document purpose is required');
    }
    if (!type) {
      throw new BadRequestException('Document type is required');
    }
    return await this.documentsService.uploadDocument(
      correlation_id,
      user.user_id,
      file,
      name,
      purpose,
      type,
      document_type,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-documents')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user documents' })
  @ApiResponse({
    status: 200,
    description: 'User documents retrieved successfully',
  })
  async getUserDocuments(
    @Correlation() correlation_id: string,
    @GetUser() user: any,
  ) {
    return await this.documentsService.getUserDocuments(
      correlation_id,
      user.user_id,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all documents (Admin only)' })
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
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getAllDocuments(
    @Correlation() correlation_id: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('status') status?: string,
  ) {
    return await this.documentsService.getAllDocuments(
      correlation_id,
      page,
      limit,
      status,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get document by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getDocument(
    @Correlation() correlation_id: string,
    @Param('id') documentId: string,
  ) {
    return await this.documentsService.getDocument(correlation_id, documentId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id/status')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update document status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['pending', 'approved', 'rejected'],
        },
        rejection_reason: {
          type: 'string',
          description: 'Required if status is rejected',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Document status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async updateDocumentStatus(
    @Correlation() correlation_id: string,
    @Param('id') documentId: string,
    @Body('status') status: DocumentStatus,
    @GetUser() user: any,
    @Body('rejection_reason') rejectionReason?: string,
  ) {
    return await this.documentsService.updateDocumentStatus(
      correlation_id,
      documentId,
      status,
      user.user_id,
      rejectionReason,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete document (Admin only)' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async deleteDocument(
    @Correlation() correlation_id: string,
    @Param('id') documentId: string,
  ) {
    return await this.documentsService.deleteDocument(
      correlation_id,
      documentId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/preview')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Preview document' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({
    status: 200,
    description: 'Document preview served successfully',
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async previewDocument(
    @Correlation() correlation_id: string,
    @Param('id') documentId: string,
    @Res() res: Response,
  ) {
    const result = await this.documentsService.serveDocument(
      correlation_id,
      documentId,
    );

    res.setHeader('Content-Type', result.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    return res.sendFile(result.filePath);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Download document' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document downloaded successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async downloadDocument(
    @Correlation() correlation_id: string,
    @Param('id') documentId: string,
    @Res() res: Response,
  ) {
    const result = await this.documentsService.serveDocument(
      correlation_id,
      documentId,
    );

    res.setHeader('Content-Type', result.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.originalName}"`,
    );

    return res.sendFile(result.filePath);
  }
}
