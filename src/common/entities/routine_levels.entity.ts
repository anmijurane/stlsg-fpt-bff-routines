import { Column, Entity } from "typeorm";

@Entity('routine_levels')
export class RoutineLevels {
  @Column({ type: 'smallint', primary: true })
  id: number;

  @Column({ type: 'text', nullable: false })
  label: string;
}
