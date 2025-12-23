import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Correlation } from 'src/core/correlation/correlation.decorator';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import type { Response } from 'express';
import * as XLSX from 'xlsx';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new course (Admin only)' })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({
    status: 201,
    description: 'Course created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            stream: { type: 'string' },
            duration_years: { type: 'number' },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async create(
    @Correlation() correlation_id: string,
    @Body() createCourseDto: CreateCourseDto,
    @GetUser() current_user: any,
  ) {
    return await this.coursesService.create(correlation_id, createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses with pagination and search' })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Search term for name or stream',
  })
  @ApiQuery({
    name: 'stream',
    required: false,
    type: String,
    description: 'Filter by stream',
  })
  @ApiQuery({
    name: 'durationYears',
    required: false,
    type: Number,
    description: 'Filter by duration in years',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Courses retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            courses: { type: 'array', items: { type: 'object' } },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
          },
        },
      },
    },
  })
  async findAll(
    @Correlation() correlation_id: string,
    @Query('q') q?: string,
    @Query('stream') stream?: string,
    @Query('durationYears', new ParseIntPipe({ optional: true }))
    durationYears?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return await this.coursesService.list(correlation_id, {
      q,
      stream,
      durationYears,
      page,
      limit,
    });
  }

  @Get('by-ids')
  @ApiOperation({ summary: 'Get courses by IDs' })
  @ApiQuery({
    name: 'ids',
    required: true,
    type: String,
    description: 'Comma-separated list of course IDs',
  })
  @ApiResponse({
    status: 200,
    description: 'Courses retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { type: 'array', items: { type: 'object' } },
      },
    },
  })
  async findByIds(
    @Correlation() correlation_id: string,
    @Query('ids') ids: string,
  ) {
    const courseIds = ids.split(',').map((id) => id.trim());
    return await this.coursesService.findByIds(correlation_id, courseIds);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'Course retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            stream: { type: 'string' },
            duration_years: { type: 'number' },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async findOne(
    @Correlation() correlation_id: string,
    @Param('id') id: string,
  ) {
    return await this.coursesService.findById(correlation_id, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a course (Admin only)' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({
    status: 200,
    description: 'Course updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            stream: { type: 'string' },
            duration_years: { type: 'number' },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async update(
    @Correlation() correlation_id: string,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @GetUser() current_user: any,
  ) {
    return await this.coursesService.update(
      correlation_id,
      id,
      updateCourseDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a course (Admin only)' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'Course deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async remove(
    @Correlation() correlation_id: string,
    @Param('id') id: string,
    @GetUser() current_user: any,
  ) {
    return await this.coursesService.remove(correlation_id, id);
  }

  @Post('import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import courses from Excel/CSV file (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Courses imported successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            created: { type: 'array', items: { type: 'object' } },
            updated: { type: 'array', items: { type: 'object' } },
            failed: { type: 'array', items: { type: 'object' } },
            total_processed: { type: 'number' },
            successful: { type: 'number' },
            failed_count: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async importCourses(
    @Correlation() correlation_id: string,
    @GetUser() current_user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    let coursesData: any[] = [];
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();

    try {
      if (fileExtension === 'csv') {
        // Parse CSV
        const csvData = file.buffer.toString('utf8');
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map((h) => h.trim());

        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map((v) => v.trim());
            const row: any = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            coursesData.push(row);
          }
        }
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // Parse Excel
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        coursesData = jsonData as any[];
      } else {
        throw new Error(
          'Unsupported file format. Please use CSV or Excel files.',
        );
      }

      // Transform data to match DTO
      const transformedData = coursesData.map((row: any) => ({
        id: row.id || undefined,
        name: row.name || row.Name || '',
        stream: row.stream || row.Stream || undefined,
        durationYears: parseInt(
          row.durationYears || row.duration_years || row.Duration || '0',
        ),
        description: row.description || row.Description || undefined,
      }));

      return await this.coursesService.importCourses(
        correlation_id,
        transformedData,
      );
    } catch (error) {
      throw new Error(`Failed to parse file: ${error.message}`);
    }
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Export courses to CSV (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Courses exported successfully',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async exportCoursesCSV(
    @Correlation() correlation_id: string,
    @GetUser() current_user: any,
    @Res() res: Response,
  ) {
    const result = await this.coursesService.exportCourses(correlation_id);
    const courses = result.data;

    // Create CSV content
    const headers = [
      'id',
      'name',
      'stream',
      'duration_years',
      'description',
      'created_at',
      'updated_at',
    ];
    const csvContent = [
      headers.join(','),
      ...courses.map((course) =>
        [
          course.id,
          `"${course.name}"`,
          course.stream ? `"${course.stream}"` : '',
          course.duration_years,
          course.description
            ? `"${course.description.replace(/"/g, '""')}"`
            : '',
          course.created_at,
          course.updated_at,
        ].join(','),
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=courses.csv');
    res.send(csvContent);
  }

  @Get('export/excel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Export courses to Excel (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Courses exported successfully',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async exportCoursesExcel(
    @Correlation() correlation_id: string,
    @GetUser() current_user: any,
    @Res() res: Response,
  ) {
    const result = await this.coursesService.exportCourses(correlation_id);
    const courses = result.data;

    // Create Excel workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(courses);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Courses');

    const excelBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=courses.xlsx');
    res.send(excelBuffer);
  }
}
