import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './entities/user.entity';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';
export type DocumentType =
  | 'ID_PROOF'
  | 'ADDRESS_PROOF'
  | 'MARKSHEET'
  | 'PHOTO'
  | 'OTHER';

@Entity('documents')
export class Document {
  @PrimaryColumn('varchar')
  document_id: string;

  @Column('varchar', { nullable: false })
  user_id: string;

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

  @Column('enum', {
    enum: ['ID_PROOF', 'ADDRESS_PROOF', 'MARKSHEET', 'PHOTO', 'OTHER'],
    nullable: false,
  })
  type: DocumentType;

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  uploaded_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
