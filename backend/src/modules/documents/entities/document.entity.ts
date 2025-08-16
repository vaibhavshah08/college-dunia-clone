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

export enum DocumentType {
  ADMISSION_LETTER = 'admission_letter',
  IDENTITY_PROOF = 'identity_proof',
  INCOME_CERTIFICATE = 'income_certificate',
  CASTE_CERTIFICATE = 'caste_certificate',
  DIPLOMA_CERTIFICATE = 'diploma_certificate',
  OTHER = 'other',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type: DocumentType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verifiedBy: number;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.documents)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
