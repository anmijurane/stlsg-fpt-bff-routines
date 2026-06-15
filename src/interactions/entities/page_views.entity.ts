import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sessions } from "./sessions.entity";
import { RoutineLevels } from "../../common/entities/routine_levels.entity";

@Entity('page_views')
export class PageViews {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: false })
  session_id: string;

  @ManyToOne(() => Sessions)
  @JoinColumn({ name: 'session_id' })
  session: Sessions;

  @Column({ type: 'text', nullable: false })
  page_path: string;

  @Column({ type: 'text', nullable: true })
  query_string: string;

  @Column({ type: 'text', nullable: true, name: 'routine' })
  routine: 'adaptation' | 'muscle-gain' | 'health' | 'fat-burning' | null;

  @Column({ type: 'smallint', nullable: true })
  level_id: number;

  @ManyToOne(() => RoutineLevels)
  @JoinColumn({ name: 'level_id' })
  level: RoutineLevels;

  @Column({ type: 'timestamptz' })
  visited_at: Date;
}
