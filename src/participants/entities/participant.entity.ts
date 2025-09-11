import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'participants' })
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  number: string;

  @Column()
  fullname: string;
  
  @Column()
  dni: string;
  
  @Column()
  cel: string;

  @Column()
  mail: string;
  
  @Column({ nullable: true })
  payment_id: string;

}

