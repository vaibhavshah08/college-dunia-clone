import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewStatus } from './review.entity';
import { customHttpError } from 'src/core/custom-error/error-service';
import { ENTITY_NOT_FOUND } from 'src/core/custom-error/error-constant';
import { CustomLogger } from 'src/core/logger/logger.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly repo: Repository<Review>,
    private readonly logger: CustomLogger,
  ) {}

  async submit(correlation_id: string, user_id: string, data: { course_id: string; text: string }) {
    this.logger.setContext(this.constructor.name);
    this.logger.log(correlation_id, `Submitting review for user ${user_id}, course ${data.course_id}`);
    const entity = this.repo.create({
      user_id,
      course_id: data.course_id,
      text: data.text,
      status: 'pending',
    });
    const savedEntity = await this.repo.save(entity);
    this.logger.log(correlation_id, `Review submitted successfully: ${savedEntity.id}`);
    return savedEntity;
  }

  async listPublicByCourse(correlation_id: string, course_id: string) {
    this.logger.setContext(this.constructor.name);
    this.logger.log(correlation_id, `Listing public reviews for course: ${course_id}`);
    const results = await this.repo.find({
      where: { course_id, status: 'approved' },
    });
    this.logger.log(correlation_id, `Found ${results.length} public reviews for course ${course_id}`);
    return results;
  }

  async adminList(correlation_id: string) {
    this.logger.setContext(this.constructor.name);
    this.logger.log(correlation_id, 'Listing all reviews for admin');
    const results = await this.repo.find();
    this.logger.log(correlation_id, `Found ${results.length} total reviews`);
    return results;
  }

  async updateStatus(correlation_id: string, id: string, status: ReviewStatus) {
    this.logger.setContext(this.constructor.name);
    this.logger.log(correlation_id, `Updating review status for ${id} to ${status}`);
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      this.logger.error(correlation_id, `Review not found for status update: ${id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'REVIEW_NOT_FOUND',
        'Review not found',
        HttpStatus.NOT_FOUND,
      );
    }
    existing.status = status;
    const savedEntity = await this.repo.save(existing);
    this.logger.log(correlation_id, `Review status updated successfully: ${id} -> ${status}`);
    return savedEntity;
  }
}
