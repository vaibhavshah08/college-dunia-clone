import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { College } from './entities/college.entity';
import { Course } from './entities/course.entity';

@Injectable()
export class CollegesService {
  constructor(
    @InjectRepository(College)
    private collegeRepository: Repository<College>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async findAll(query: any = {}) {
    const queryBuilder = this.collegeRepository
      .createQueryBuilder('college')
      .leftJoinAndSelect('college.courses', 'courses')
      .where('college.isActive = :isActive', { isActive: true });

    if (query.search) {
      queryBuilder.andWhere(
        '(college.name LIKE :search OR college.city LIKE :search OR college.state LIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.city) {
      queryBuilder.andWhere('college.city = :city', { city: query.city });
    }

    if (query.state) {
      queryBuilder.andWhere('college.state = :state', { state: query.state });
    }

    if (query.minRanking) {
      queryBuilder.andWhere('college.ranking <= :minRanking', {
        minRanking: query.minRanking,
      });
    }

    if (query.maxFees) {
      queryBuilder.andWhere('college.averageFees <= :maxFees', {
        maxFees: query.maxFees,
      });
    }

    const [colleges, total] = await queryBuilder
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();

    return {
      data: colleges,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async findById(id: number) {
    const college = await this.collegeRepository.findOne({
      where: { id, isActive: true },
      relations: ['courses'],
    });

    if (!college) {
      throw new NotFoundException('College not found');
    }

    return college;
  }

  async create(createCollegeDto: any) {
    const college = this.collegeRepository.create(createCollegeDto);
    return await this.collegeRepository.save(college);
  }

  async update(id: number, updateCollegeDto: any) {
    const college = await this.findById(id);
    Object.assign(college, updateCollegeDto);
    return await this.collegeRepository.save(college);
  }

  async delete(id: number): Promise<void> {
    const college = await this.findById(id);
    college.isActive = false;
    await this.collegeRepository.save(college);
    return;
  }

  async compareColleges(collegeIds: number[]) {
    return await this.collegeRepository.find({
      where: { id: In(collegeIds) },
      relations: ['courses'],
    });
  }
}
