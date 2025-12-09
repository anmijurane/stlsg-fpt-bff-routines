import { Column, Entity } from "typeorm";

@Entity('sessions')
export class Sessions {
  @Column({ type: 'uuid', primary: true })
  id: string;

  @Column({ type: 'text', nullable: false })
  club_id: string;

  @Column({ type: 'text', nullable: false })
  user_agent_browser: string;

  @Column({ type: 'text', nullable: false })
  user_agent_os: string;

  @Column({ type: 'text', nullable: false })
  user_agent_device: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  first_seen_at: Date;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  last_seen_at: Date;

}
