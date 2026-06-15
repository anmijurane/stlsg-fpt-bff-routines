import { Column, Entity } from "typeorm";

@Entity('clubs')
export class Clubs {

  @Column({ type: 'text', primary: true })
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  city: string;

  @Column({ type: 'text', nullable: true })
  address: string;

}
