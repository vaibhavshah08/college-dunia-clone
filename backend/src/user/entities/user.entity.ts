import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn('varchar', { nullable: false })
  user_id: string;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar')
  password: string; // hashed

  @Column('varchar', { default: null, nullable: true })
  course: string;

  @Column('boolean', { default: false })
  is_admin: boolean;

  @Column('boolean', { default: true })
  is_active: boolean;

  @Column('boolean', { default: false })
  is_deleted: boolean;

  @Column('boolean', { default: false })
  is_blocked: boolean;

  @Column('varchar', { default: null, nullable: true })
  phone_number: string;

  @Column('boolean', { default: false })
  is_phone_verified: boolean;

  @Column('varchar', { default: null, nullable: true })
  city: string;

  @Column('boolean', { default: false })
  is_email_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
