import { Column, Entity } from "typeorm";

@Entity('events')
export class Events {

  @Column({ type: 'uuid', primary: true })
  id: string;

  @Column({ type: 'uuid', nullable: false })
  session_id: string;

  @Column({ type: 'text', nullable: false })
  page_view_id: string;

  @Column({
    type: 'text',
    nullable: false,
    enum: ['exercise_view', 'routine_view', 'feedback']
  })
  type: string;

  @Column({ type: 'text', nullable: false })
  exercise_id: string;

  @Column({ type: 'text', nullable: false })
  exercise_name: string;

  @Column({ type: 'text', nullable: false })
  routine: string;

  @Column({ type: 'smallint', nullable: false })
  level_id: number;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

}

