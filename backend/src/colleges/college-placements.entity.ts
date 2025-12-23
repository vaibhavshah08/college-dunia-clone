import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('college_placements')
@Index(['college_id'])
@Index(['year'])
@Index(['college_id', 'year'])
export class CollegePlacement {
  @PrimaryColumn('varchar')
  placement_id: string;

  @Column('varchar', { nullable: false })
  college_id: string;

  @Column('int', { nullable: false })
  year: number;

  @Column('int', { nullable: false })
  total_students: number;

  @Column('int', { nullable: false })
  placed_students: number;

  @Column('float', { nullable: false })
  highest_package: number;

  @Column('float', { nullable: false })
  average_package: number;
}
