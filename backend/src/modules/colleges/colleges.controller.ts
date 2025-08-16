import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CollegesService } from './colleges.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('colleges')
export class CollegesController {
  constructor(private collegesService: CollegesService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.collegesService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.collegesService.findById(id);
  }

  @Get('compare/:ids')
  async compareColleges(@Param('ids') ids: string) {
    const collegeIds = ids.split(',').map((id) => parseInt(id));
    return this.collegesService.compareColleges(collegeIds);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createCollegeDto: any) {
    return this.collegesService.create(createCollegeDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCollegeDto: any,
  ) {
    return this.collegesService.update(id, updateCollegeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.collegesService.delete(id);
  }
}
