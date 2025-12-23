import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';

@Entity('documents')
@Index(['user_id']) // Index for user-based queries
@Index(['loan_id']) // Index for loan-based queries
@Index(['status']) // Index for status-based filtering
@Index(['is_deleted']) // Index for soft delete filtering
@Index(['uploaded_at']) // Index for date-based sorting
@Index(['document_type']) // Index for type-based filtering
@Index(['user_id', 'status']) // Composite index for user status queries
@Index(['reviewed_by']) // Index for reviewer-based queries
export class Document {
  @PrimaryColumn('varchar')
  document_id: string;

  @Column('varchar', { nullable: false })
  user_id: string;

  @Column('varchar', { nullable: true })
  loan_id: string | null;

  @Column('varchar', { nullable: false })
  document_path: string;

  @Column('varchar', { nullable: false })
  original_name: string;

  @Column('varchar', { nullable: false })
  mime_type: string;

  @Column('int', { nullable: false })
  file_size: number;

  @Column('varchar', { nullable: true })
  document_type: string;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: false })
  purpose: string;

  @Column('varchar', { nullable: false })
  type: string;

  @Column('enum', {
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: DocumentStatus;

  @Column('text', { nullable: true })
  rejection_reason: string;

  @Column('varchar', { nullable: true })
  reviewed_by: string;

  @Column('timestamp', { nullable: true })
  reviewed_at: Date;

  @Column('boolean', { default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  uploaded_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
