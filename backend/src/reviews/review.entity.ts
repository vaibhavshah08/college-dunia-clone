import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

@Entity('reviews')
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
