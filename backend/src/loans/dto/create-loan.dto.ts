import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoanDto {
  @ApiProperty({
    description: 'Type of loan',
    example: 'Education Loan',
    enum: ['Education Loan', 'Personal Loan', 'Home Loan'],
  })
  @IsString()
  @IsNotEmpty()
  readonly loan_type: string;

  @ApiProperty({
    description: 'Principal amount in INR',
    example: 500000,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly principal_amount: number;

  @ApiProperty({
    description: 'Annual interest rate (percentage)',
    example: 8.5,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly interest_rate: number;

  @ApiProperty({
    description: 'Loan term in months',
    example: 60,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly term_months: number;

  @ApiProperty({
    description: 'College ID for education loan',
    example: 'col_123',
  })
  @IsString()
  @IsNotEmpty()
  readonly college_id: string;

  @ApiProperty({
    description: 'Phone number for loan application',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  readonly phone_number: string;

  @ApiProperty({
    description: 'First name of the applicant',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  readonly first_name: string;

  @ApiProperty({
    description: 'Last name of the applicant',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  readonly last_name: string;

  @ApiProperty({
    description: 'Gender of the applicant',
    example: 'Male',
    enum: ['Male', 'Female', 'Other'],
  })
  @IsString()
  @IsNotEmpty()
  readonly gender: string;

  @ApiProperty({
    description: 'WhatsApp number (optional if same as phone number)',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly whatsapp_number?: string;

  @ApiProperty({
    description: 'Additional description (optional)',
    example: 'Loan for Computer Science Engineering course',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly description?: string;
}
