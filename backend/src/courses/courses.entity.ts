import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('courses')
@Index(['name'])
@Index(['stream'])
@Index(['duration_years'])
@Index(['is_deleted'])
@Index(['stream', 'duration_years'])
@Index(['created_at'])
export class Course {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: true })
  stream: string;

  @Column('int', { nullable: false })
  duration_years: number;

  @Column('longtext', { nullable: true })
  description: string;

  @Column('boolean', { default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
