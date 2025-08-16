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
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post()
  async create(@Body() createDocumentDto: any, @Request() req) {
    return this.documentsService.create(createDocumentDto, req.user.id);
  }

  @Get('my-documents')
  async getMyDocuments(@Request() req) {
    return this.documentsService.findByUser(req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(@Query() query: any) {
    return this.documentsService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.findById(id);
  }

  @Put(':id/verify')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async verifyDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: { isVerified: boolean; adminNotes?: string },
    @Request() req,
  ) {
    return this.documentsService.verifyDocument(
      id,
      updateDto.isVerified,
      updateDto.adminNotes,
      req.user.id,
    );
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.documentsService.delete(id, req.user.id);
  }
}
