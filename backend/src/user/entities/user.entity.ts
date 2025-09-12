import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryColumn('varchar')
  user_id: string;

  @Column('varchar', { nullable: false })
  first_name: string;

  @Column('varchar', { nullable: false })
  last_name: string;

  @Column('varchar', { unique: true, nullable: false })
  email: string;

  @Column('varchar', { nullable: false })
  phone_number: string;

  @Column('varchar', { nullable: false })
  @Exclude()
  password: string; // hashed

  @Column('boolean', { default: false })
  is_admin: boolean;

  @Column('boolean', { default: true })
  is_active: boolean;

  @Column('boolean', { default: false })
  is_deleted: boolean;

  @Column('varchar', { unique: true, nullable: true })
  google_id: string;

  @Column('varchar', { nullable: true })
  avatar_url: string;

  @Column('boolean', { default: false })
  email_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
