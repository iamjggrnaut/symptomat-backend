import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { HospitalsDoctors } from '.';

const tableName = 'hospitals';

@Entity({ name: tableName })
export class Hospital extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'int', default: 0 })
  patientsLimit: number;

  @OneToMany(() => HospitalsDoctors, (hd) => hd.hospital)
  hospitalDoctors: HospitalsDoctors[];
}
