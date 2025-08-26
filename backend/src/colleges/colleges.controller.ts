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
import { CollegesService } from './colleges.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Correlation } from 'src/core/correlation/correlation.decorator';

@Controller('colleges')
export class CollegesController {
  constructor(private readonly service: CollegesService) {}

  @Get()
  async list(@Correlation() correlation_id: string, @Query() query: any) {
    return await this.service.list(correlation_id, {
      q: query.q,
      stream: query.stream,
      location: query.location,
      min_cutoff: query.min_cutoff ? Number(query.min_cutoff) : undefined,
      max_fees: query.max_fees ? Number(query.max_fees) : undefined,
      ranking: query.ranking ? Number(query.ranking) : undefined,
    });
  }

  @Get(':id')
  async get(@Correlation() correlation_id: string, @Param('id') id: string) {
    return await this.service.findById(correlation_id, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Correlation() correlation_id: string, @Body() body: any) {
    return await this.service.create(correlation_id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  async update(@Correlation() correlation_id: string, @Param('id') id: string, @Body() body: any) {
    return await this.service.update(correlation_id, id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Correlation() correlation_id: string, @Param('id') id: string) {
    return await this.service.remove(correlation_id, id);
  }

  @Get('compare/list')
  async compare(@Correlation() correlation_id: string, @Query('ids') ids: string) {
    const parsed = ids
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
    return await this.service.compare(correlation_id, parsed);
  }
}
