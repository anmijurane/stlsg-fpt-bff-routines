import { Column, Entity } from "typeorm";

@Entity('exercises')
export class Exercises {

  @Column({ type: 'text', primary: true })
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text' })
  muscle_group: string;

  @Column({ type: 'text', nullable: false })
  zone: string;
}
