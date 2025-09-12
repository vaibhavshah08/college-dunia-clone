import { Injectable, HttpStatus, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentStatus } from '../user/documents.entity';
import { User } from '../user/entities/user.entity';
import { CustomLogger } from 'src/core/logger/logger.service';
import { customHttpError } from 'src/core/custom-error/error-service';
import {
  ENTITY_FETCH_ERROR,
  ENTITY_CREATE_ERROR,
  ENTITY_UPDATE_ERROR,
  ENTITY_NOT_FOUND,
} from 'src/core/custom-error/error-constant';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  private readonly uploadPath = path.join(
    process.cwd(),
    'uploads',
    'documents',
  );

  constructor(
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly logger: CustomLogger,
  ) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadDocument(
    correlation_id: string,
    user_id: string,
    file: Express.Multer.File,
    name: string,
    purpose: string,
    type: string,
    document_type?: string,
  ) {
    this.logger.setContext(this.constructor.name + '/uploadDocument');
    this.logger.debug(correlation_id, 'Starting document upload process');

    try {
      // Validate file
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      const allowedMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException('File type not allowed');
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new BadRequestException('File size too large');
      }

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4().replace(/-/g, '')}${fileExtension}`;
      const filePath = path.join(this.uploadPath, fileName);

      // Save file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Create document record
      const document = this.documentRepo.create({
        document_id: uuidv4().replace(/-/g, ''),
        user_id,
        document_path: `/uploads/documents/${fileName}`,
        original_name: file.originalname,
        mime_type: file.mimetype,
        file_size: file.size,
        document_type: document_type || 'general',
        name,
        purpose,
        type: type as any, // Type will be validated by the enum constraint
        status: 'pending' as DocumentStatus,
      });

      const savedDocument = await this.documentRepo.save(document);

      this.logger.debug(
        correlation_id,
        `Document uploaded successfully with ID: ${savedDocument.document_id}`,
      );

      return {
        message: 'Document uploaded successfully',
        data: {
          document_id: savedDocument.document_id,
          user_id: savedDocument.user_id,
          document_path: savedDocument.document_path,
          original_name: savedDocument.original_name,
          mime_type: savedDocument.mime_type,
          file_size: savedDocument.file_size,
          document_type: savedDocument.document_type,
          status: savedDocument.status,
          uploaded_at: savedDocument.uploaded_at,
        },
      };
    } catch (error) {
      this.logger.error(correlation_id, 'Error uploading document', error);
      throw error;
    }
  }

  async getUserDocuments(correlation_id: string, user_id: string) {
    this.logger.setContext(this.constructor.name + '/getUserDocuments');
    this.logger.debug(
      correlation_id,
      `Fetching documents for user: ${user_id}`,
    );

    try {
      const documents = await this.documentRepo.find({
        where: { user_id },
        order: { uploaded_at: 'DESC' },
      });

      return {
        message: 'User documents retrieved successfully',
        data: documents,
      };
    } catch (error) {
      this.logger.error(correlation_id, 'Error fetching user documents', error);
      throw customHttpError(
        ENTITY_FETCH_ERROR,
        'User Documents Fetch Error',
        'Failed to fetch user documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllDocuments(
    correlation_id: string,
    page: number = 1,
    limit: number = 10,
    status?: string,
  ) {
    this.logger.setContext(this.constructor.name + '/getAllDocuments');
    this.logger.debug(correlation_id, 'Fetching all documents with pagination');

    try {
      const queryBuilder = this.documentRepo
        .createQueryBuilder('document')
        .leftJoinAndSelect('document.user', 'user');

      if (status) {
        queryBuilder.where('document.status = :status', { status });
      }

      const [documents, total] = await queryBuilder
        .orderBy('document.uploaded_at', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        message: 'Documents retrieved successfully',
        data: {
          documents,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      this.logger.error(correlation_id, 'Error fetching documents', error);
      throw customHttpError(
        ENTITY_FETCH_ERROR,
        'Documents Fetch Error',
        'Failed to fetch documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDocumentStatus(
    correlation_id: string,
    documentId: string,
    status: DocumentStatus,
    reviewedBy: string,
    rejectionReason?: string,
  ) {
    this.logger.setContext(this.constructor.name + '/updateDocumentStatus');
    this.logger.debug(
      correlation_id,
      `Updating document ${documentId} status to ${status}`,
    );

    try {
      const document = await this.documentRepo.findOne({
        where: { document_id: documentId },
      });
      if (!document) {
        throw customHttpError(
          ENTITY_NOT_FOUND,
          'Document Not Found',
          'Document not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const updateData: any = {
        status,
        reviewed_by: reviewedBy,
        reviewed_at: new Date(),
      };

      if (status === 'rejected' && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      await this.documentRepo.update(documentId, updateData);

      this.logger.debug(
        correlation_id,
        `Document ${documentId} status updated to ${status}`,
      );
      return {
        message: 'Document status updated successfully',
        data: { documentId, status },
      };
    } catch (error) {
      this.logger.error(
        correlation_id,
        'Error updating document status',
        error,
      );
      throw customHttpError(
        ENTITY_UPDATE_ERROR,
        'Document Status Update Error',
        'Failed to update document status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDocument(correlation_id: string, documentId: string) {
    this.logger.setContext(this.constructor.name + '/getDocument');
    this.logger.debug(correlation_id, `Fetching document: ${documentId}`);

    try {
      const document = await this.documentRepo.findOne({
        where: { document_id: documentId },
        relations: ['user'],
      });

      if (!document) {
        throw customHttpError(
          ENTITY_NOT_FOUND,
          'Document Not Found',
          'Document not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Document retrieved successfully',
        data: document,
      };
    } catch (error) {
      this.logger.error(correlation_id, 'Error fetching document', error);
      throw customHttpError(
        ENTITY_FETCH_ERROR,
        'Document Fetch Error',
        'Failed to fetch document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteDocument(correlation_id: string, documentId: string) {
    this.logger.setContext(this.constructor.name + '/deleteDocument');
    this.logger.debug(correlation_id, `Deleting document: ${documentId}`);

    try {
      const document = await this.documentRepo.findOne({
        where: { document_id: documentId },
      });
      if (!document) {
        throw customHttpError(
          ENTITY_NOT_FOUND,
          'Document Not Found',
          'Document not found',
          HttpStatus.NOT_FOUND,
        );
      }

      // Delete file from disk
      const fullPath = path.join(process.cwd(), document.document_path);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }

      // Delete from database
      await this.documentRepo.delete(documentId);

      this.logger.debug(
        correlation_id,
        `Document ${documentId} deleted successfully`,
      );
      return {
        message: 'Document deleted successfully',
        data: { documentId },
      };
    } catch (error) {
      this.logger.error(correlation_id, 'Error deleting document', error);
      throw customHttpError(
        ENTITY_UPDATE_ERROR,
        'Document Delete Error',
        'Failed to delete document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async serveDocument(correlation_id: string, documentId: string) {
    this.logger.setContext(this.constructor.name + '/serveDocument');
    this.logger.debug(correlation_id, `Serving document: ${documentId}`);

    try {
      const document = await this.documentRepo.findOne({
        where: { document_id: documentId },
      });
      if (!document) {
        throw customHttpError(
          ENTITY_NOT_FOUND,
          'Document Not Found',
          'Document not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const fullPath = path.join(process.cwd(), document.document_path);
      if (!fs.existsSync(fullPath)) {
        throw customHttpError(
          ENTITY_NOT_FOUND,
          'Document File Not Found',
          'Document file not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        filePath: fullPath,
        mimeType: document.mime_type,
        originalName: document.original_name,
      };
    } catch (error) {
      this.logger.error(correlation_id, 'Error serving document', error);
      throw customHttpError(
        ENTITY_FETCH_ERROR,
        'Document Serve Error',
        'Failed to serve document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
