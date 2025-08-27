import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateCollegeDto {
  @IsString()
  @IsNotEmpty()
  readonly college_name: string;

  @IsString()
  @IsNotEmpty()
  readonly state: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  readonly pincode: string;

  @IsString()
  @IsOptional()
  readonly landmark?: string;

  @IsNumber()
  @IsNotEmpty()
  readonly fees: number;

  @IsNumber()
  @IsNotEmpty()
  readonly ranking: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  readonly courses_offered: string[];

  @IsNumber()
  @IsNotEmpty()
  readonly placement_ratio: number;

  @IsNumber()
  @IsNotEmpty()
  readonly year_of_establishment: number;

  @IsString()
  @IsNotEmpty()
  readonly affiliation: string;

  @IsString()
  @IsNotEmpty()
  readonly accreditation: string;
}
