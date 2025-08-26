import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { College } from './colleges.entity';
import { customHttpError } from 'src/core/custom-error/error-service';
import { ENTITY_NOT_FOUND } from 'src/core/custom-error/error-constant';
import { CustomLogger } from 'src/core/logger/logger.service';

interface FilterDto {
  q?: string;
  stream?: string;
  location?: string;
  min_cutoff?: number;
  max_fees?: number;
  ranking?: number;
}

@Injectable()
export class CollegesService {
  constructor(
    @InjectRepository(College) private readonly repo: Repository<College>,
    private readonly logger: CustomLogger,
  ) {}

  async create(correlation_id: string, data: Partial<College>) {
    this.logger.setContext(this.constructor.name);
    this.logger.log(correlation_id, `Creating new college: ${JSON.stringify(data)}`);
    const entity = this.repo.create(data);
    const savedEntity = await this.repo.save(entity);
    this.logger.log(correlation_id, `College created successfully: ${savedEntity.id}`);
    return savedEntity;
  }

  async update(correlation_id: string, id: string, data: Partial<College>) {
    this.logger.setContext(this.constructor.name);
    this.logger.log(correlation_id, `Updating college ${id}: ${JSON.stringify(data)}`);
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      this.logger.error(correlation_id, `College not found for update: ${id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'COLLEGE_NOT_FOUND',
        'College not found',
        HttpStatus.NOT_FOUND,
      );
    }
    Object.assign(existing, data);
    const savedEntity = await this.repo.save(existing);
    this.logger.log(correlation_id, `College updated successfully: ${id}`);
    return savedEntity;
  }

  async remove(correlation_id: string, id: string) {
    this.logger.setContext(this.constructor.name);
    this.logger.log(correlation_id, `Removing college: ${id}`);
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      this.logger.error(correlation_id, `College not found for removal: ${id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'COLLEGE_NOT_FOUND',
        'College not found',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.repo.remove(existing);
    this.logger.log(correlation_id, `College removed successfully: ${id}`);
    return { message: 'Deleted' };
  }

  async findById(correlation_id: string, id: string) {
    this.logger.setContext(this.constructor.name);
    this.logger.log(correlation_id, `Finding college by ID: ${id}`);
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      this.logger.error(correlation_id, `College not found: ${id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'COLLEGE_NOT_FOUND',
        'College not found',
        HttpStatus.NOT_FOUND,
      );
    }
    this.logger.log(correlation_id, `College found: ${id}`);
    return existing;
  }

  async list(correlation_id: string, filters: FilterDto) {
    this.logger.setContext(this.constructor.name);
    this.logger.log(correlation_id, `Listing colleges with filters: ${JSON.stringify(filters)}`);
    const qb = this.repo.createQueryBuilder('c');
    if (filters.q) {
      qb.andWhere('c.name LIKE :q OR c.description LIKE :q', {
        q: `%${filters.q}%`,
      });
    }
    if (filters.stream)
      qb.andWhere('c.stream = :stream', { stream: filters.stream });
    if (filters.location)
      qb.andWhere('c.location = :location', { location: filters.location });
    if (filters.min_cutoff != null)
      qb.andWhere('c.cutoff_score >= :min_cutoff', {
        min_cutoff: filters.min_cutoff,
      });
    if (filters.max_fees != null)
      qb.andWhere('c.fees <= :max_fees', { max_fees: filters.max_fees });
    if (filters.ranking != null)
      qb.andWhere('c.ranking <= :ranking', { ranking: filters.ranking });
    qb.orderBy('c.ranking', 'ASC', 'NULLS LAST');
    const results = await qb.getMany();
    this.logger.log(correlation_id, `Found ${results.length} colleges`);
    return results;
  }

  async compare(correlation_id: string, ids: string[]) {
    this.logger.setContext(this.constructor.name);
    this.logger.log(correlation_id, `Comparing colleges: ${ids.join(', ')}`);
    const results = await this.repo.find({ where: { id: In(ids) } });
    this.logger.log(correlation_id, `Found ${results.length} colleges for comparison`);
    return results;
  }
}
