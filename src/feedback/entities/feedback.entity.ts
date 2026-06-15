import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sessions } from '../../interactions/entities/sessions.entity';
import { Exercises } from '../../common/entities/exercises.entity';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: false })
  session_id: string;

  @ManyToOne(() => Sessions)
  @JoinColumn({ name: 'session_id' })
  session: Sessions;

  @Column({ type: 'text', nullable: true })
  exercise_id: string;

  @ManyToOne(() => Exercises)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercises;

  @Column({
    type: 'enum',
    enum: ['happy', 'neutral', 'sad', 'null'],
    nullable: false,
  })
  emoji: 'happy' | 'neutral' | 'sad' | 'null';

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
