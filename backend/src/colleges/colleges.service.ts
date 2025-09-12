import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { College } from './colleges.entity';
import { CollegePlacement } from './college-placements.entity';
import { customHttpError } from 'src/core/custom-error/error-service';
import { ENTITY_NOT_FOUND } from 'src/core/custom-error/error-constant';
import { CustomLogger } from 'src/core/logger/logger.service';
import { v4 as uuidv4 } from 'uuid';

interface FilterDto {
  q?: string;
  state?: string;
  city?: string;
  minFees?: number;
  maxFees?: number;
  ranking?: number;
  courses_offered?: string[];
}

@Injectable()
export class CollegesService {
  constructor(
    @InjectRepository(College) private readonly repo: Repository<College>,
    @InjectRepository(CollegePlacement)
    private readonly placement_repo: Repository<CollegePlacement>,
    private readonly logger: CustomLogger,
  ) {}

  async create(correlation_id: string, data: Partial<College>) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(correlation_id, 'Starting college creation process');
    this.logger.debug(
      correlation_id,
      `Creating new college: ${JSON.stringify(data)}`,
    );

    this.logger.debug(correlation_id, 'Generating college ID');
    const college_id = uuidv4().replace(/-/g, '');

    this.logger.debug(correlation_id, 'Creating college entity');
    const entity = this.repo.create({
      ...data,
      college_id: college_id,
    });

    this.logger.debug(correlation_id, 'Saving college to database');
    const saved_entity = await this.repo.save(entity);
    this.logger.debug(
      correlation_id,
      `College created successfully: ${saved_entity.college_id}`,
    );

    return {
      message: 'College created successfully',
      data: {
        college_id: saved_entity.college_id,
        college_name: saved_entity.college_name,
        state: saved_entity.state,
        city: saved_entity.city,
        pincode: saved_entity.pincode,
        landmark: saved_entity.landmark,
        fees: saved_entity.fees,
        ranking: saved_entity.ranking,
        courses_offered: saved_entity.courses_offered,
        placement_ratio: saved_entity.placement_ratio,
        year_of_establishment: saved_entity.year_of_establishment,
        affiliation: saved_entity.affiliation,
        accreditation: saved_entity.accreditation,
        created_at: saved_entity.created_at,
        is_partnered: saved_entity.is_partnered,
        avg_package: saved_entity.avg_package,
        median_package: saved_entity.median_package,
        highest_package: saved_entity.highest_package,
        placement_rate: saved_entity.placement_rate,
        top_recruiters: saved_entity.top_recruiters,
        placement_last_updated: saved_entity.placement_last_updated,
      },
    };
  }

  async update(correlation_id: string, id: string, data: Partial<College>) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(
      correlation_id,
      `Starting college update process for ID: ${id}`,
    );
    this.logger.debug(
      correlation_id,
      `Updating college ${id}: ${JSON.stringify(data)}`,
    );

    this.logger.debug(correlation_id, 'Finding existing college in database');
    const existing = await this.repo.findOne({ where: { college_id: id } });
    if (!existing) {
      this.logger.debug(correlation_id, `College not found for update: ${id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'COLLEGE_NOT_FOUND',
        'College not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.debug(correlation_id, 'Updating college entity');
    Object.assign(existing, data);

    this.logger.debug(correlation_id, 'Saving updated college to database');
    const saved_entity = await this.repo.save(existing);
    this.logger.debug(correlation_id, `College updated successfully: ${id}`);

    return {
      message: 'College updated successfully',
      data: {
        college_id: saved_entity.college_id,
        college_name: saved_entity.college_name,
        state: saved_entity.state,
        city: saved_entity.city,
        pincode: saved_entity.pincode,
        landmark: saved_entity.landmark,
        fees: saved_entity.fees,
        ranking: saved_entity.ranking,
        courses_offered: saved_entity.courses_offered,
        placement_ratio: saved_entity.placement_ratio,
        year_of_establishment: saved_entity.year_of_establishment,
        affiliation: saved_entity.affiliation,
        accreditation: saved_entity.accreditation,
        created_at: saved_entity.created_at,
        is_partnered: saved_entity.is_partnered,
        avg_package: saved_entity.avg_package,
        median_package: saved_entity.median_package,
        highest_package: saved_entity.highest_package,
        placement_rate: saved_entity.placement_rate,
        top_recruiters: saved_entity.top_recruiters,
        placement_last_updated: saved_entity.placement_last_updated,
      },
    };
  }

  async bulkCreate(correlation_id: string, collegesData: Partial<College>[]) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(correlation_id, 'Starting bulk college creation process');
    this.logger.debug(
      correlation_id,
      `Creating ${collegesData.length} colleges`,
    );

    const createdColleges: any[] = [];
    const errors: any[] = [];

    for (let i = 0; i < collegesData.length; i++) {
      try {
        const collegeData = collegesData[i];
        this.logger.debug(
          correlation_id,
          `Creating college ${i + 1}/${collegesData.length}: ${collegeData.college_name}`,
        );

        const college_id = uuidv4().replace(/-/g, '');
        const entity = this.repo.create({
          ...collegeData,
          college_id: college_id,
        });

        const saved_entity = await this.repo.save(entity);
        createdColleges.push({
          college_id: saved_entity.college_id,
          college_name: saved_entity.college_name,
          state: saved_entity.state,
          city: saved_entity.city,
        });
      } catch (error) {
        this.logger.error(
          correlation_id,
          `Failed to create college ${i + 1}: ${error.message}`,
        );
        errors.push({
          index: i + 1,
          college_name: collegesData[i].college_name || 'Unknown',
          error: error.message,
        });
      }
    }

    this.logger.debug(
      correlation_id,
      `Bulk creation completed: ${createdColleges.length} successful, ${errors.length} failed`,
    );

    return {
      message: `Bulk college creation completed. ${createdColleges.length} colleges created successfully, ${errors.length} failed.`,
      data: {
        created: createdColleges,
        errors: errors,
        total_processed: collegesData.length,
        successful: createdColleges.length,
        failed: errors.length,
      },
    };
  }

  async remove(correlation_id: string, id: string) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(
      correlation_id,
      `Starting college removal process for ID: ${id}`,
    );

    this.logger.debug(correlation_id, 'Finding college in database');
    const existing = await this.repo.findOne({ where: { college_id: id } });
    if (!existing) {
      this.logger.debug(correlation_id, `College not found for removal: ${id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'COLLEGE_NOT_FOUND',
        'College not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.debug(correlation_id, 'Removing college from database');
    await this.repo.remove(existing);
    this.logger.debug(correlation_id, `College removed successfully: ${id}`);

    return { message: 'College deleted successfully' };
  }

  async findById(correlation_id: string, id: string) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(correlation_id, `Finding college by ID: ${id}`);

    this.logger.debug(correlation_id, 'Querying database for college');
    const existing = await this.repo.findOne({ where: { college_id: id } });
    if (!existing) {
      this.logger.debug(correlation_id, `College not found: ${id}`);
      throw customHttpError(
        ENTITY_NOT_FOUND,
        'COLLEGE_NOT_FOUND',
        'College not found',
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.debug(correlation_id, `College found successfully: ${id}`);
    return {
      message: 'College found successfully',
      data: {
        college_id: existing.college_id,
        college_name: existing.college_name,
        state: existing.state,
        city: existing.city,
        pincode: existing.pincode,
        landmark: existing.landmark,
        fees: existing.fees,
        ranking: existing.ranking,
        courses_offered: existing.courses_offered,
        placement_ratio: existing.placement_ratio,
        year_of_establishment: existing.year_of_establishment,
        affiliation: existing.affiliation,
        accreditation: existing.accreditation,
        created_at: existing.created_at,
        is_partnered: existing.is_partnered,
        avg_package: existing.avg_package,
        median_package: existing.median_package,
        highest_package: existing.highest_package,
        placement_rate: existing.placement_rate,
        top_recruiters: existing.top_recruiters,
        placement_last_updated: existing.placement_last_updated,
      },
    };
  }

  async list(correlation_id: string, filters: FilterDto) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(correlation_id, 'Starting college listing process');
    this.logger.debug(
      correlation_id,
      `Listing colleges with filters: ${JSON.stringify(filters)}`,
    );

    this.logger.debug(correlation_id, 'Building database query');
    const qb = this.repo.createQueryBuilder('c');

    if (filters.q) {
      this.logger.debug(correlation_id, 'Applying search filter');
      qb.andWhere(
        'c.college_name LIKE :q OR c.state LIKE :q OR c.city LIKE :q',
        {
          q: `%${filters.q}%`,
        },
      );
    }
    if (filters.state) {
      this.logger.debug(correlation_id, 'Applying state filter');
      qb.andWhere('c.state = :state', { state: filters.state });
    }
    if (filters.city) {
      this.logger.debug(correlation_id, 'Applying city filter');
      qb.andWhere('c.city = :city', { city: filters.city });
    }
    if (filters.minFees != null) {
      this.logger.debug(correlation_id, 'Applying minimum fees filter');
      qb.andWhere('c.fees >= :minFees', { minFees: filters.minFees });
    }
    if (filters.maxFees != null) {
      this.logger.debug(correlation_id, 'Applying maximum fees filter');
      qb.andWhere('c.fees <= :maxFees', { maxFees: filters.maxFees });
    }
    if (filters.ranking != null) {
      this.logger.debug(correlation_id, 'Applying ranking filter');
      qb.andWhere('c.ranking <= :ranking', { ranking: filters.ranking });
    }
    if (filters.courses_offered && filters.courses_offered.length > 0) {
      this.logger.debug(correlation_id, 'Applying courses offered filter');
      // For simple-array type, we need to use FIND_IN_SET for MySQL
      const courseConditions = filters.courses_offered
        .map(
          (course, index) => `FIND_IN_SET(:course${index}, c.courses_offered)`,
        )
        .join(' OR ');
      qb.andWhere(
        `(${courseConditions})`,
        filters.courses_offered.reduce((params, course, index) => {
          params[`course${index}`] = course;
          return params;
        }, {}),
      );
    }

    qb.orderBy('c.ranking', 'ASC');

    this.logger.debug(correlation_id, 'Executing database query');
    const results = await qb.getMany();
    this.logger.debug(correlation_id, `Found ${results.length} colleges`);

    return {
      message: 'Colleges retrieved successfully',
      data: results.map((college) => ({
        college_id: college.college_id,
        college_name: college.college_name,
        state: college.state,
        city: college.city,
        pincode: college.pincode,
        landmark: college.landmark,
        fees: college.fees,
        ranking: college.ranking,
        courses_offered: college.courses_offered,
        placement_ratio: college.placement_ratio,
        year_of_establishment: college.year_of_establishment,
        affiliation: college.affiliation,
        accreditation: college.accreditation,
        created_at: college.created_at,
        is_partnered: college.is_partnered,
        avg_package: college.avg_package,
        median_package: college.median_package,
        highest_package: college.highest_package,
        placement_rate: college.placement_rate,
        top_recruiters: college.top_recruiters,
        placement_last_updated: college.placement_last_updated,
      })),
    };
  }

  async compare(correlation_id: string, ids: string[]) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(correlation_id, 'Starting college comparison process');
    this.logger.debug(correlation_id, `Comparing colleges: ${ids.join(', ')}`);

    this.logger.debug(correlation_id, 'Querying database for colleges');
    const results = await this.repo.find({ where: { college_id: In(ids) } });
    this.logger.debug(
      correlation_id,
      `Found ${results.length} colleges for comparison`,
    );

    return {
      message: 'Colleges comparison retrieved successfully',
      data: results.map((college) => ({
        college_id: college.college_id,
        college_name: college.college_name,
        state: college.state,
        city: college.city,
        pincode: college.pincode,
        landmark: college.landmark,
        fees: college.fees,
        ranking: college.ranking,
        courses_offered: college.courses_offered,
        placement_ratio: college.placement_ratio,
        year_of_establishment: college.year_of_establishment,
        affiliation: college.affiliation,
        accreditation: college.accreditation,
        created_at: college.created_at,
        is_partnered: college.is_partnered,
        avg_package: college.avg_package,
        median_package: college.median_package,
        highest_package: college.highest_package,
        placement_rate: college.placement_rate,
        top_recruiters: college.top_recruiters,
        placement_last_updated: college.placement_last_updated,
      })),
    };
  }

  async addPlacement(
    correlation_id: string,
    placement_data: Partial<CollegePlacement>,
  ) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(
      correlation_id,
      'Starting placement data addition process',
    );
    this.logger.debug(
      correlation_id,
      `Adding placement data: ${JSON.stringify(placement_data)}`,
    );

    this.logger.debug(correlation_id, 'Generating placement ID');
    const placement_id = uuidv4();

    this.logger.debug(correlation_id, 'Creating placement entity');
    const entity = this.placement_repo.create({
      ...placement_data,
      placement_id: placement_id,
    });

    this.logger.debug(correlation_id, 'Saving placement to database');
    const saved_entity = await this.placement_repo.save(entity);
    this.logger.debug(
      correlation_id,
      `Placement data added successfully: ${saved_entity.placement_id}`,
    );

    return {
      message: 'Placement data added successfully',
      data: {
        placement_id: saved_entity.placement_id,
        college_id: saved_entity.college_id,
        year: saved_entity.year,
        total_students: saved_entity.total_students,
        placed_students: saved_entity.placed_students,
        highest_package: saved_entity.highest_package,
        average_package: saved_entity.average_package,
      },
    };
  }

  async getPlacements(correlation_id: string, college_id: string) {
    this.logger.setContext(this.constructor.name);
    this.logger.debug(
      correlation_id,
      'Starting placement data retrieval process',
    );
    this.logger.debug(
      correlation_id,
      `Getting placements for college: ${college_id}`,
    );

    this.logger.debug(correlation_id, 'Querying database for placements');
    const placements = await this.placement_repo.find({
      where: { college_id: college_id },
      order: { year: 'DESC' },
    });
    this.logger.debug(
      correlation_id,
      `Found ${placements.length} placement records`,
    );

    return {
      message: 'Placement data retrieved successfully',
      data: placements.map((placement) => ({
        placement_id: placement.placement_id,
        college_id: placement.college_id,
        year: placement.year,
        total_students: placement.total_students,
        placed_students: placement.placed_students,
        highest_package: placement.highest_package,
        average_package: placement.average_package,
      })),
    };
  }
}
