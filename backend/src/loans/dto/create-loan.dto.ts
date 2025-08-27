import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateLoanDto {
  @IsString()
  @IsNotEmpty()
  readonly loan_type: string;

  @IsNumber()
  @IsNotEmpty()
  readonly principal_amount: number;

  @IsNumber()
  @IsNotEmpty()
  readonly interest_rate: number;

  @IsNumber()
  @IsNotEmpty()
  readonly term_months: number;

  @IsString()
  @IsNotEmpty()
  readonly college_id: string;

  @IsString()
  @IsOptional()
  readonly description?: string;
}
