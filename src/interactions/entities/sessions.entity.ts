import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Clubs } from "../../common/entities/clubs.entity";

@Entity('sessions')
export class Sessions {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'uuid' })
  session_ref: string;

  @Column({ type: 'text', nullable: true })
  slug: string;

  @Column({ type: 'text', nullable: false })
  club_id: string;

  @ManyToOne(() => Clubs)
  @JoinColumn({ name: 'club_id' })
  club: Clubs;

  @Column({ type: 'inet', nullable: true })
  client_ip: string;

  @Column({ type: 'text', nullable: true })
  user_agent_browser: string;

  @Column({ type: 'text', nullable: true })
  user_agent_os: string;

  @Column({ type: 'text', nullable: true })
  user_agent_device: string;

  @Column({ type: 'timestamptz' })
  first_seen_at: Date;

  @Column({ type: 'timestamptz' })
  last_seen_at: Date;
}
