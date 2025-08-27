import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { College } from './colleges.entity';
import { CollegePlacement } from './college-placements.entity';
import { CollegesService } from './colleges.service';
import { CollegesController } from './colleges.controller';
import { LoggerModule } from 'src/core/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([College, CollegePlacement]),
    LoggerModule,
  ],
  controllers: [CollegesController],
  providers: [CollegesService],
  exports: [CollegesService],
})
export class CollegesModule {}
