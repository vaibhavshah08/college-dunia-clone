import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

@Entity('reviews')
@Index(['user_id']) // Index for user-based queries
@Index(['course_id']) // Index for course-based queries
@Index(['status']) // Index for status-based filtering
@Index(['created_at']) // Index for date-based sorting
@Index(['course_id', 'status']) // Composite index for course status queries
export class Review {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar')
  user_id: string;

  @Column('varchar')
  course_id: string;

  @Column('text')
  text: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: ReviewStatus;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
