import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('colleges')
export class College {
  @PrimaryColumn('varchar')
  college_id: string;

  @Column('varchar', { nullable: false })
  college_name: string;

  @Column('varchar', { nullable: false })
  state: string;

  @Column('varchar', { nullable: false })
  city: string;

  @Column('varchar', { nullable: false })
  pincode: string;

  @Column('varchar', { nullable: true, default: null })
  landmark: string;

  @Column('float', { nullable: false })
  fees: number;

  @Column('int', { nullable: false })
  ranking: number;

  @Column('simple-array', { nullable: false })
  courses_offered: string[]; // [CSE, ME, ECE]

  @Column('float', { nullable: false })
  placement_ratio: number;

  @Column('int', { nullable: false })
  year_of_establishment: number;

  @Column('varchar', { nullable: false })
  affiliation: string;

  @Column('varchar', { nullable: false })
  accreditation: string;

  @Column('boolean', { nullable: false, default: false })
  is_partnered: boolean;

  @Column('float', { nullable: true })
  avg_package: number;

  @Column('float', { nullable: true })
  median_package: number;

  @Column('float', { nullable: true })
  highest_package: number;

  @Column('float', { nullable: true })
  placement_rate: number;

  @Column('simple-array', { nullable: true })
  top_recruiters: string[];

  @Column('timestamp', { nullable: true })
  placement_last_updated: Date;

  @CreateDateColumn()
  created_at: Date;
}
