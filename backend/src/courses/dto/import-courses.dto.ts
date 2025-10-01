import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class ImportCourseRowDto {
  @ApiProperty({
    description: 'Course ID (optional, for updates)',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'Course name',
    example: 'B.Tech',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Course stream',
    example: 'CSE',
    required: false,
  })
  @IsOptional()
  @IsString()
  stream?: string;

  @ApiProperty({
    description: 'Duration in years',
    example: 4,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  durationYears: number;

  @ApiProperty({
    description: 'Course description (HTML/JSON)',
    example: '<p>Bachelor of Technology in Computer Science</p>',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
