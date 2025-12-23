import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type LoanStatus = 'submitted' | 'under_review' | 'approved' | 'rejected';

@Entity('loans')
@Index(['user_id'])
@Index(['status'])
@Index(['college_id'])
@Index(['is_deleted'])
@Index(['created_at'])
@Index(['user_id', 'status'])
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

  @Column('varchar', { nullable: false })
  phone_number: string;

  @Column('varchar', { nullable: false })
  first_name: string;

  @Column('varchar', { nullable: false })
  last_name: string;

  @Column('varchar', { nullable: false })
  gender: string;

  @Column('varchar', { nullable: true })
  whatsapp_number: string;

  @Column('text', { nullable: true, default: null })
  description: string;

  @Column('boolean', { default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  created_at: Date;
}
