import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DemographicAgeRange, DemographicGender, DemographicMembership } from 'src/app-types/demographic-form';
import { Sessions } from 'src/interactions/entities/sessions.entity';

@Entity('demographic_forms')
export class DemographicForm {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: false })
  session_id: string;

  @ManyToOne(() => Sessions)
  @JoinColumn({ name: 'session_id' })
  session: Sessions;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'other'],
    enumName: 'demographic_gender',
    nullable: false,
  })
  gender: DemographicGender;

  @Column({
    type: 'enum',
    enum: ['<18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    enumName: 'demographic_age_range',
    nullable: false,
  })
  age_range: DemographicAgeRange;

  @Column({
    type: 'enum',
    enum: ['classic-card', 'pf-black-card', 'invite'],
    enumName: 'demographic_membership',
    nullable: false,
  })
  membership: DemographicMembership;

  @Column({ type: 'text', nullable: true })
  contact_email: string | null;

  @Column({ type: 'text', nullable: true })
  contact_phone: string | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
