import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreatePlacementDto {
  @IsNumber()
  @IsNotEmpty()
  readonly year: number;

  @IsNumber()
  @IsNotEmpty()
  readonly total_students: number;

  @IsNumber()
  @IsNotEmpty()
  readonly placed_students: number;

  @IsNumber()
  @IsNotEmpty()
  readonly highest_package: number;

  @IsNumber()
  @IsNotEmpty()
  readonly average_package: number;
}
