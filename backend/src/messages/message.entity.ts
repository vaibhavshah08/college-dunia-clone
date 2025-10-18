import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('messages')
@Index(['is_read', 'is_deleted'])
@Index(['created_at'])
@Index(['email'])
export class Message {
  @PrimaryColumn('varchar')
  message_id: string;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: false })
  email: string;

  @Column('varchar', { nullable: false })
  subject: string;

  @Column('longtext', { nullable: false })
  message: string;

  @Column('boolean', { default: false })
  is_read: boolean;

  @Column('boolean', { default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
