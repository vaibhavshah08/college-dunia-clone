import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from '../user/documents.entity';
import { User } from '../user/entities/user.entity';
import { LoggerModule } from 'src/core/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document, User]), LoggerModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
