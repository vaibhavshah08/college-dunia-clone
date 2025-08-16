import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { LoanStatus } from './entities/loan-application.entity';

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Post()
  async create(@Body() createLoanDto: any, @Request() req) {
    return this.loansService.create(createLoanDto, req.user.id);
  }

  @Get('my-applications')
  async getMyApplications(@Request() req) {
    return this.loansService.findByUser(req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(@Query() query: any) {
    return this.loansService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.loansService.findById(id);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: { status: LoanStatus; adminNotes?: string },
    @Request() req,
  ) {
    return this.loansService.updateStatus(
      id,
      updateDto.status,
      updateDto.adminNotes,
      req.user.id,
    );
  }
}
