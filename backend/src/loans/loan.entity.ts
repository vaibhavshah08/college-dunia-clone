import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

export type LoanStatus = 'submitted' | 'under_review' | 'approved' | 'rejected';

@Entity('loans')
export class LoanApplication {
  @PrimaryColumn('varchar')
  loan_id: string;

  @Column('varchar', { nullable: false })
  user_id: string;

  @Column('varchar', { nullable: false })
  loan_type: string;

  @Column('float', { nullable: false })
  principal_amount: number;

  @Column('float', { nullable: false })
  interest_rate: number;

  @Column('int', { nullable: false })
  term_months: number;

  @Column({ type: 'varchar', nullable: false })
  status: LoanStatus;

  @Column('varchar', { nullable: false })
  college_id: string;

  @Column('text', { nullable: true, default: null })
  description: string;

  @CreateDateColumn()
  created_at: Date;
}
