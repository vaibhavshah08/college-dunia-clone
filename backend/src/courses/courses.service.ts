import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Course } from './courses.entity';
import { customHttpError } from 'src/core/custom-error/error-service';
import { ENTITY_NOT_FOUND } from 'src/core/custom-error/error-constant';
import { CustomLogger } from 'src/core/logger/logger.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ImportCourseRowDto } from './dto/import-courses.dto';

interface FilterDto {
  q?: string;
  stream?: string;
  durationYears?: number;
  page?: number;
  limit?: number;
}

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private readonly repo: Repository<Course>,
    private readonly logger: CustomLogger,
  ) {}

  async create(correlation_id: string, data: CreateCourseDto) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(correlation_id, 'Starting course creation process');
    this.logger.debug(
      correlation_id,
      `Creating new course: ${JSON.stringify(data)}`,
    );

    this.logger.debug(correlation_id, 'Generating course ID');
    const course_id = uuidv4().replace(/-/g, '');

    this.logger.debug(correlation_id, 'Creating course entity');
    const entity = this.repo.create({
      ...data,
      id: course_id,
      duration_years: data.durationYears,
    });

    this.logger.debug(correlation_id, 'Saving course to database');
    const saved_entity = await this.repo.save(entity);
    this.logger.debug(
      correlation_id,
      `Course created successfully: ${saved_entity.id}`,
    );

    return {
      message: 'Course created successfully',
      data: {
        id: saved_entity.id,
        name: saved_entity.name,
        stream: saved_entity.stream,
        duration_years: saved_entity.duration_years,
        description: saved_entity.description,
        created_at: saved_entity.created_at,
        updated_at: saved_entity.updated_at,
      },
    };
  }

  async update(correlation_id: string, id: string, data: UpdateCourseDto) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(
      correlation_id,
      `Starting course update process for ID: ${id}`,
    );
    this.logger.debug(
      correlation_id,
      `Updating course ${id}: ${JSON.stringify(data)}`,
    );

    this.logger.debug(correlation_id, 'Finding existing course in database');
    const existing = await this.repo.findOne({ where: { id: id } });
    if (!existing) {
      this.logger.debug(correlation_id, `Course not found for update: ${id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'COURSE_NOT_FOUND',
        'Course not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.debug(correlation_id, 'Updating course entity');
    const updateData: any = { ...data };
    if (data.durationYears) {
      updateData.duration_years = data.durationYears;
    }
    Object.assign(existing, updateData);

    this.logger.debug(correlation_id, 'Saving updated course to database');
    const saved_entity = await this.repo.save(existing);
    this.logger.debug(correlation_id, `Course updated successfully: ${id}`);

    return {
      message: 'Course updated successfully',
      data: {
        id: saved_entity.id,
        name: saved_entity.name,
        stream: saved_entity.stream,
        duration_years: saved_entity.duration_years,
        description: saved_entity.description,
        created_at: saved_entity.created_at,
        updated_at: saved_entity.updated_at,
      },
    };
  }

  async remove(correlation_id: string, id: string) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(
      correlation_id,
      `Starting course removal process for ID: ${id}`,
    );

    this.logger.debug(correlation_id, 'Finding course in database');
    const existing = await this.repo.findOne({ where: { id: id } });
    if (!existing) {
      this.logger.debug(correlation_id, `Course not found for removal: ${id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'COURSE_NOT_FOUND',
        'Course not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.debug(correlation_id, 'Soft deleting course from database');
    existing.is_deleted = true;
    await this.repo.save(existing);
    this.logger.debug(
      correlation_id,
      `Course soft deleted successfully: ${id}`,
    );

    return { message: 'Course deleted successfully' };
  }

  async findById(correlation_id: string, id: string) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(correlation_id, `Finding course by ID: ${id}`);

    this.logger.debug(correlation_id, 'Querying database for course');
    const existing = await this.repo.findOne({
      where: { id: id, is_deleted: false },
    });
    if (!existing) {
      this.logger.debug(correlation_id, `Course not found: ${id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'COURSE_NOT_FOUND',
        'Course not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.debug(correlation_id, `Course found successfully: ${id}`);
    return {
      message: 'Course found successfully',
      data: {
        id: existing.id,
        name: existing.name,
        stream: existing.stream,
        duration_years: existing.duration_years,
        description: existing.description,
        created_at: existing.created_at,
        updated_at: existing.updated_at,
      },
    };
  }

  async list(correlation_id: string, filters: FilterDto) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(correlation_id, 'Starting course listing process');
    this.logger.debug(
      correlation_id,
      `Listing courses with filters: ${JSON.stringify(filters)}`,
    );

    this.logger.debug(correlation_id, 'Building database query');
    const qb = this.repo.createQueryBuilder('c');
    qb.where('c.is_deleted = :is_deleted', { is_deleted: false });

    if (filters.q) {
      this.logger.debug(correlation_id, 'Applying search filter');
      qb.andWhere('c.name LIKE :q OR c.stream LIKE :q', {
        q: `%${filters.q}%`,
      });
    }
    if (filters.stream) {
      this.logger.debug(correlation_id, 'Applying stream filter');
      qb.andWhere('c.stream = :stream', { stream: filters.stream });
    }
    if (filters.durationYears != null) {
      this.logger.debug(correlation_id, 'Applying duration filter');
      qb.andWhere('c.duration_years = :durationYears', {
        durationYears: filters.durationYears,
      });
    }

    qb.orderBy('c.name', 'ASC');

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    qb.skip(offset).take(limit);

    this.logger.debug(correlation_id, 'Executing database query');
    const [results, total] = await qb.getManyAndCount();
    this.logger.debug(correlation_id, `Found ${results.length} courses`);

    return {
      message: 'Courses retrieved successfully',
      data: {
        courses: results.map((course) => ({
          id: course.id,
          name: course.name,
          stream: course.stream,
          duration_years: course.duration_years,
          description: course.description,
          created_at: course.created_at,
          updated_at: course.updated_at,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async findByIds(correlation_id: string, ids: string[]) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(
      correlation_id,
      `Finding courses by IDs: ${ids.join(', ')}`,
    );

    this.logger.debug(correlation_id, 'Querying database for courses');
    const results = await this.repo.find({
      where: { id: In(ids), is_deleted: false },
    });
    this.logger.debug(
      correlation_id,
      `Found ${results.length} courses for IDs`,
    );

    return {
      message: 'Courses retrieved successfully',
      data: results.map((course) => ({
        id: course.id,
        name: course.name,
        stream: course.stream,
        duration_years: course.duration_years,
        description: course.description,
        created_at: course.created_at,
        updated_at: course.updated_at,
      })),
    };
  }

  async importCourses(
    correlation_id: string,
    coursesData: ImportCourseRowDto[],
  ) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(correlation_id, 'Starting bulk course import process');
    this.logger.debug(
      correlation_id,
      `Importing ${coursesData.length} courses`,
    );

    const createdCourses: any[] = [];
    const updatedCourses: any[] = [];
    const errors: any[] = [];

    for (let i = 0; i < coursesData.length; i++) {
      try {
        const courseData = coursesData[i];
        this.logger.debug(
          correlation_id,
          `Processing course ${i + 1}/${coursesData.length}: ${courseData.name}`,
        );

        if (courseData.id) {
          // Update existing course
          const existing = await this.repo.findOne({
            where: { id: courseData.id },
          });
          if (existing) {
            const updateData: any = {
              name: courseData.name,
              stream: courseData.stream,
              duration_years: courseData.durationYears,
              description: courseData.description,
            };
            Object.assign(existing, updateData);
            const saved_entity = await this.repo.save(existing);
            updatedCourses.push({
              id: saved_entity.id,
              name: saved_entity.name,
              stream: saved_entity.stream,
            });
          } else {
            errors.push({
              row: i + 1,
              course_name: courseData.name,
              error: 'Course ID not found',
            });
          }
        } else {
          // Create new course
          const course_id = uuidv4().replace(/-/g, '');
          const entity = this.repo.create({
            id: course_id,
            name: courseData.name,
            stream: courseData.stream,
            duration_years: courseData.durationYears,
            description: courseData.description,
          });
          const saved_entity = await this.repo.save(entity);
          createdCourses.push({
            id: saved_entity.id,
            name: saved_entity.name,
            stream: saved_entity.stream,
          });
        }
      } catch (error) {
        this.logger.error(
          correlation_id,
          `Failed to process course ${i + 1}: ${error.message}`,
        );
        errors.push({
          row: i + 1,
          course_name: coursesData[i].name || 'Unknown',
          error: error.message,
        });
      }
    }

    this.logger.debug(
      correlation_id,
      `Import completed: ${createdCourses.length} created, ${updatedCourses.length} updated, ${errors.length} failed`,
    );

    return {
      message: `Course import completed. ${createdCourses.length} created, ${updatedCourses.length} updated, ${errors.length} failed.`,
      data: {
        created: createdCourses,
        updated: updatedCourses,
        failed: errors,
        total_processed: coursesData.length,
        successful: createdCourses.length + updatedCourses.length,
        failed_count: errors.length,
      },
    };
  }

  async exportCourses(correlation_id: string) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(correlation_id, 'Starting course export process');

    this.logger.debug(correlation_id, 'Querying database for all courses');
    const courses = await this.repo.find({
      where: { is_deleted: false },
      order: { name: 'ASC' },
    });
    this.logger.debug(
      correlation_id,
      `Found ${courses.length} courses for export`,
    );

    return {
      message: 'Courses exported successfully',
      data: courses.map((course) => ({
        id: course.id,
        name: course.name,
        stream: course.stream,
        duration_years: course.duration_years,
        description: course.description,
        created_at: course.created_at,
        updated_at: course.updated_at,
      })),
    };
  }
}
