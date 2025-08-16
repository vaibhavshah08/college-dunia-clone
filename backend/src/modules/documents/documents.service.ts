import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async create(createDocumentDto: any, userId: number): Promise<Document> {
    const document = this.documentRepository.create({
      ...createDocumentDto,
      userId,
    });
    return this.documentRepository.save(document);
  }

  async findByUser(userId: number): Promise<Document[]> {
    return this.documentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(query: any = {}): Promise<any> {
    const queryBuilder = this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.user', 'user');

    if (query.type) {
      queryBuilder.andWhere('document.type = :type', { type: query.type });
    }

    if (query.isVerified !== undefined) {
      queryBuilder.andWhere('document.isVerified = :isVerified', {
        isVerified: query.isVerified,
      });
    }

    const [documents, total] = await queryBuilder
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();

    return {
      data: documents,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async findById(id: number): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async verifyDocument(
    id: number,
    isVerified: boolean,
    adminNotes?: string,
    adminId?: number,
  ): Promise<Document> {
    const document = await this.findById(id);
    document.isVerified = isVerified;
    document.adminNotes = adminNotes;
    document.verifiedBy = adminId;
    document.verifiedAt = new Date();
    return this.documentRepository.save(document);
  }

  async delete(id: number, userId: number): Promise<void> {
    const document = await this.documentRepository.findOne({
      where: { id, userId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.documentRepository.remove(document);
  }
}
