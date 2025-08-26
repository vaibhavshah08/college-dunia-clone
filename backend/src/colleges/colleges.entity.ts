import { Entity, PrimaryColumn, Column } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('colleges')
export class College {
  @PrimaryColumn('varchar')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar', { default: null, nullable: true })
  stream: string | null;

  @Column('varchar', { default: null, nullable: true })
  location: string | null;

  @Column('float', { default: null, nullable: true })
  cutoff_score: number | null;

  @Column('int', { default: null, nullable: true })
  ranking: number | null;

  @Column('int', { default: null, nullable: true })
  fees: number | null;

  @Column('json', { default: null, nullable: true })
  facilities: any | null;

  @Column('text', { default: null, nullable: true })
  description: string | null;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
