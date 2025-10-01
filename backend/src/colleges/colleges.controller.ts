import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CollegesService } from './colleges.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { BulkCreateCollegeDto } from './dto/bulk-create-college.dto';
import { CreatePlacementDto } from './dto/create-placement.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Correlation } from 'src/core/correlation/correlation.decorator';

@ApiTags('Colleges')
@Controller('colleges')
export class CollegesController {
  constructor(private readonly service: CollegesService) {}

  @Get()
  @ApiOperation({ summary: 'Get colleges list with filters' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiQuery({ name: 'state', required: false, description: 'Filter by state' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city' })
  @ApiQuery({ name: 'minFees', required: false, description: 'Minimum fees' })
  @ApiQuery({ name: 'maxFees', required: false, description: 'Maximum fees' })
  @ApiQuery({
    name: 'ranking',
    required: false,
    description: 'Filter by ranking',
  })
  @ApiQuery({
    name: 'coursesOffered',
    required: false,
    description: 'Filter by courses (comma-separated)',
  })
  @ApiResponse({
    status: 200,
    description: 'Colleges list retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              college_id: { type: 'string' },
              college_name: { type: 'string' },
              state: { type: 'string' },
              city: { type: 'string' },
              fees: { type: 'number' },
              ranking: { type: 'number' },
              courses_offered: { type: 'array', items: { type: 'string' } },
              placement_ratio: { type: 'number' },
            },
          },
        },
      },
    },
  })
  async list(@Correlation() correlation_id: string, @Query() query: any) {
    return await this.service.list(correlation_id, {
      q: query.q,
      state: query.state,
      city: query.city,
      minFees: query.minFees ? Number(query.minFees) : undefined,
      maxFees: query.maxFees ? Number(query.maxFees) : undefined,
      ranking: query.ranking ? Number(query.ranking) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get college by ID' })
  @ApiParam({ name: 'id', description: 'College ID' })
  @ApiResponse({
    status: 200,
    description: 'College details retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            college_id: { type: 'string' },
            college_name: { type: 'string' },
            state: { type: 'string' },
            city: { type: 'string' },
            fees: { type: 'number' },
            ranking: { type: 'number' },
            courses_offered: { type: 'array', items: { type: 'string' } },
            placement_ratio: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'College not found' })
  async get(@Correlation() correlation_id: string, @Param('id') id: string) {
    return await this.service.findById(correlation_id, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new college (Admin only)' })
  @ApiBody({ type: CreateCollegeDto })
  @ApiResponse({
    status: 201,
    description: 'College created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async create(
    @Correlation() correlation_id: string,
    @Body() body: CreateCollegeDto,
  ) {
    return await this.service.create(correlation_id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('bulk')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create multiple colleges at once (Admin only)' })
  @ApiBody({ type: BulkCreateCollegeDto })
  @ApiResponse({
    status: 201,
    description: 'Colleges created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            created: { type: 'array' },
            errors: { type: 'array' },
            total_processed: { type: 'number' },
            successful: { type: 'number' },
            failed: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async bulkCreate(
    @Correlation() correlation_id: string,
    @Body() body: BulkCreateCollegeDto,
  ) {
    return await this.service.bulkCreate(correlation_id, body.colleges);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update college (Admin only)' })
  @ApiParam({ name: 'id', description: 'College ID' })
  @ApiResponse({ status: 200, description: 'College updated successfully' })
  @ApiResponse({ status: 404, description: 'College not found' })
  async update(
    @Correlation() correlation_id: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return await this.service.update(correlation_id, id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete college (Admin only)' })
  @ApiParam({ name: 'id', description: 'College ID' })
  @ApiResponse({ status: 200, description: 'College deleted successfully' })
  @ApiResponse({ status: 404, description: 'College not found' })
  async remove(@Correlation() correlation_id: string, @Param('id') id: string) {
    return await this.service.remove(correlation_id, id);
  }

  @Get('compare/list')
  @ApiOperation({ summary: 'Compare colleges' })
  @ApiQuery({ name: 'ids', description: 'Comma-separated college IDs' })
  @ApiResponse({
    status: 200,
    description: 'College comparison retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  })
  async compare(
    @Correlation() correlation_id: string,
    @Query('ids') ids: string,
  ) {
    const parsed = ids
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
    return await this.service.compare(correlation_id, parsed);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':id/placements')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add placement data for college (Admin only)' })
  @ApiParam({ name: 'id', description: 'College ID' })
  @ApiBody({ type: CreatePlacementDto })
  @ApiResponse({
    status: 201,
    description: 'Placement data added successfully',
  })
  async addPlacement(
    @Correlation() correlation_id: string,
    @Param('id') college_id: string,
    @Body() placement_data: CreatePlacementDto,
  ) {
    return await this.service.addPlacement(correlation_id, {
      ...placement_data,
      college_id: college_id,
    });
  }

  @Get(':id/placements')
  @ApiOperation({ summary: 'Get placement data for college' })
  @ApiParam({ name: 'id', description: 'College ID' })
  @ApiResponse({
    status: 200,
    description: 'Placement data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  })
  async getPlacements(
    @Correlation() correlation_id: string,
    @Param('id') college_id: string,
  ) {
    return await this.service.getPlacements(correlation_id, college_id);
  }
}
