import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventType, RoutineType } from 'src/app-types/interactions';
import { Exercises } from 'src/common/entities/exercises.entity';
import { RoutineLevels } from 'src/common/entities/routine_levels.entity';
import { Sessions } from 'src/interactions/entities/sessions.entity';

export type RoutineFeedbackType = Extract<EventType, 'feedback_routine' | 'feedback_exercise'>;
export type RoutineFeedbackValue = 'liked' | 'disliked';

@Entity('routine_feedback')
export class RoutineFeedback {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: false })
  session_id: string;

  @ManyToOne(() => Sessions)
  @JoinColumn({ name: 'session_id' })
  session: Sessions;

  @Column({
    type: 'enum',
    enum: ['feedback_routine', 'feedback_exercise'],
    enumName: 'event_type',
  })
  type: RoutineFeedbackType;

  @Column({
    type: 'enum',
    enum: ['liked', 'disliked'],
    enumName: 'routine_feedback_value',
  })
  value: RoutineFeedbackValue;

  @Column({
    type: 'enum',
    enum: ['adaptation', 'muscle_gain', 'health', 'fat_burning'],
    enumName: 'routine_type',
  })
  routine: RoutineType;

  @Column({ type: 'text', nullable: true })
  exercise_id: string | null;

  @ManyToOne(() => Exercises)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercises;

  @Column({ type: 'smallint', nullable: false })
  level_id: number;

  @ManyToOne(() => RoutineLevels)
  @JoinColumn({ name: 'level_id' })
  level: RoutineLevels;

  @Column({ type: 'int', nullable: false })
  day_routine: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
