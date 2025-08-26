import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export type LoanStatus = 'submitted' | 'under_review' | 'approved' | 'rejected';

@Entity('loans')
export class LoanApplication {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar')
  user_id: string;

  @Column('varchar', { default: null, nullable: true })
  college_id: string | null;

  @Column('int')
  amount: number;

  @Column('text', { default: null, nullable: true })
  purpose: string | null;

  @Column({ type: 'varchar' })
  status: LoanStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
