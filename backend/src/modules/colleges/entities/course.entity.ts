import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { College } from './college.entity';

export enum CourseType {
  ENGINEERING = 'engineering',
  MEDICAL = 'medical',
  ARTS = 'arts',
  COMMERCE = 'commerce',
  SCIENCE = 'science',
  LAW = 'law',
  MANAGEMENT = 'management',
  OTHER = 'other',
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: CourseType,
  })
  type: CourseType;

  @Column()
  duration: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fees: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cutoffScore: number;

  @Column({ type: 'int', nullable: true })
  seats: number;

  @Column({ type: 'json', nullable: true })
  syllabus: string[];

  @Column({ type: 'json', nullable: true })
  eligibility: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column()
  collegeId: number;

  @ManyToOne(() => College, (college) => college.courses)
  @JoinColumn({ name: 'collegeId' })
  college: College;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
