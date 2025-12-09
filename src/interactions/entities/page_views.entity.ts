import { Column, Entity } from "typeorm";

@Entity('page_views')
export class PageViews {

  @Column({ type: 'uuid', primary: true })
  id: string;

  @Column({ type: 'uuid', nullable: false })
  session_id: string;

  @Column({ type: 'text', nullable: false })
  page_path: string;

  @Column({ type: 'text', nullable: false })
  query_string: string;

  @Column({ type: 'text', nullable: false })
  routine: string;

  @Column({ type: 'smallint', nullable: false })
  level_id: number;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  visited_at: Date;

}
