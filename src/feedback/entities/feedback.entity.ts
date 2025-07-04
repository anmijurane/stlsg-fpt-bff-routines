import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Emoji } from '../types';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    enum: ['happy', 'neutral', 'sad', 'null'],
    nullable: true,
  })
  emoji: Emoji;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) // zona horaria incluida
  created_at: Date;

  @Column({ type: 'text', nullable: true })
  page_path?: string;

  @Column({ type: 'text', nullable: true })
  user_agent?: string;

  @Column({ type: 'boolean', default: false })
  rejected: boolean;

  @Column({ type: 'text', nullable: true })
  ip?: string;

  @Column({ type: 'text', nullable: true })
  sedeId?: string;

  @Column({ type: 'text', nullable: true })
  sessionId?: string;
}
