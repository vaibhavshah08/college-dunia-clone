import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Course } from './course.entity';

@Entity('colleges')
export class College {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  location: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  pincode: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  ranking: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cutoffScore: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  averageFees: number;

  @Column({ type: 'json', nullable: true })
  facilities: string[];

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ nullable: true })
  logo: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  admissionCriteria: object;

  @Column({ type: 'json', nullable: true })
  placementStats: object;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Course, (course) => course.college)
  courses: Course[];
}
