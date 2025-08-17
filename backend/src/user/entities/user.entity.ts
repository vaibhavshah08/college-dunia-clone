import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // hashed

  @Column({ nullable: true })
  course: string;

  @Column({ default: false })
  is_admin: boolean;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ default: false })
  is_blocked: boolean;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ default: false })
  is_phone_verified: boolean;

  @Column({ nullable: true })
  city: string;

  @Column({ default: false })
  is_email_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
