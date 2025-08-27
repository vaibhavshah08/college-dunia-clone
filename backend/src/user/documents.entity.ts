import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('documents')
export class Document {
  @PrimaryColumn('varchar')
  document_id: string;

  @Column('varchar', { nullable: false })
  user_id: string;

  @Column('varchar', { nullable: false })
  document_path: string;

  @CreateDateColumn()
  uploaded_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
