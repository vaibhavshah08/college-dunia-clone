import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum LoanPurpose {
  TUITION_FEES = 'tuition_fees',
  HOSTEL_FEES = 'hostel_fees',
  BOOKS_MATERIALS = 'books_materials',
  OTHER = 'other',
}

@Entity('loan_applications')
export class LoanApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: LoanPurpose,
  })
  purpose: LoanPurpose;

  @Column()
  collegeName: string;

  @Column()
  courseName: string;

  @Column()
  duration: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: LoanStatus,
    default: LoanStatus.PENDING,
  })
  status: LoanStatus;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @Column({ nullable: true })
  approvedBy: number;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.loanApplications)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
