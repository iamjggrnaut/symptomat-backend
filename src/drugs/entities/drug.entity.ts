import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { DrugsQuestions } from '.';

const tableName = 'drugs';
@Entity({ name: tableName })
export class Drug extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  @Index({ unique: true })
  name: string;

  @OneToMany(() => DrugsQuestions, (dq) => dq.drug, { cascade: true })
  drugsQuestions: DrugsQuestions[];
}
