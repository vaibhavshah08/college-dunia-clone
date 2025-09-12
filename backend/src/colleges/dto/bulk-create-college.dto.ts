import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCollegeDto } from './create-college.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BulkCreateCollegeDto {
  @ApiProperty({
    description: 'Array of colleges to create',
    type: [CreateCollegeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCollegeDto)
  readonly colleges: CreateCollegeDto[];
}
