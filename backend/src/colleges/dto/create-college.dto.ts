import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCollegeDto {
  @ApiProperty({
    description: 'Name of the college',
    example: 'Indian Institute of Technology Bombay',
  })
  @IsString()
  @IsNotEmpty()
  readonly college_name: string;

  @ApiProperty({
    description: 'State where the college is located',
    example: 'Maharashtra',
  })
  @IsString()
  @IsNotEmpty()
  readonly state: string;

  @ApiProperty({
    description: 'City where the college is located',
    example: 'Mumbai',
  })
  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @ApiProperty({
    description: 'Pincode of the college location',
    example: '400076',
  })
  @IsString()
  @IsNotEmpty()
  readonly pincode: string;

  @ApiProperty({
    description: 'Landmark near the college (optional)',
    example: 'Near Powai Lake',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly landmark?: string;

  @ApiProperty({
    description: 'Annual fees in INR',
    example: 200000,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly fees: number;

  @ApiProperty({
    description: 'College ranking',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly ranking: number;

  @ApiProperty({
    description: 'Placement ratio (percentage)',
    example: 85.5,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly placement_ratio: number;

  @ApiProperty({
    description: 'Year when the college was established',
    example: 1958,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly year_of_establishment: number;

  @ApiProperty({
    description: 'Affiliation body',
    example: 'AICTE',
  })
  @IsString()
  @IsNotEmpty()
  readonly affiliation: string;

  @ApiProperty({
    description: 'Accreditation body',
    example: 'NAAC',
  })
  @IsString()
  @IsNotEmpty()
  readonly accreditation: string;

  @ApiProperty({
    description: 'Whether this is a partnered college',
    example: false,
    required: false,
  })
  @IsOptional()
  readonly is_partnered?: boolean;

  @ApiProperty({
    description: 'Average package offered (in INR)',
    example: 1200000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  readonly avg_package?: number;

  @ApiProperty({
    description: 'Median package offered (in INR)',
    example: 1000000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  readonly median_package?: number;

  @ApiProperty({
    description: 'Highest package offered (in INR)',
    example: 2000000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  readonly highest_package?: number;

  @ApiProperty({
    description: 'Placement rate (percentage)',
    example: 85.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  readonly placement_rate?: number;

  @ApiProperty({
    description: 'Top recruiting companies',
    example: ['Google', 'Microsoft', 'Amazon'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly top_recruiters?: string[];

  @ApiProperty({
    description: 'Linked course IDs',
    example: ['course-id-1', 'course-id-2'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly courseIds?: string[];
}
