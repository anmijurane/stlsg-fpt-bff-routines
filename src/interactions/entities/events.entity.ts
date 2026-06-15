import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sessions } from "./sessions.entity";
import { PageViews } from "./page_views.entity";
import { Exercises } from "../../common/entities/exercises.entity";
import { RoutineLevels } from "../../common/entities/routine_levels.entity";
import { EventType } from "src/app-types/interactions";

@Entity('events')
export class Events {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: false })
  session_id: string;

  @ManyToOne(() => Sessions)
  @JoinColumn({ name: 'session_id' })
  session: Sessions;

  @Column({ type: 'bigint', nullable: true })
  page_view_id: string;

  @ManyToOne(() => PageViews)
  @JoinColumn({ name: 'page_view_id' })
  page_view: PageViews;

  @Column({
    type: 'enum',
    enum: ['home', 'attention_view', 'exercise_view', 'routine_view', 'feedback', 'other'],
    nullable: false,
    name: 'type'
  })
  type: EventType;

  @Column({ type: 'text', nullable: true })
  exercise_id: string;

  @ManyToOne(() => Exercises)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercises;

  @Column({ type: 'text', nullable: true })
  exercise_name: string;

  @Column({ type: 'enum', enum: ['adaptation', 'muscle-gain', 'health', 'fat-burning'], nullable: true, name: 'routine' })
  routine: 'adaptation' | 'muscle-gain' | 'health' | 'fat-burning' | null;

  @Column({ type: 'smallint', nullable: true })
  level_id: number;

  @ManyToOne(() => RoutineLevels)
  @JoinColumn({ name: 'level_id' })
  level: RoutineLevels;

  @Column({ type: 'int', nullable: true })
  day_routine: number;

  @Column({ type: 'timestamptz' })
  created_at: Date;
}

