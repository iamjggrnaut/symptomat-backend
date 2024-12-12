import { Base } from 'src/common/entities/base.entity';
import { Hospital } from 'src/hospitals/entities';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

const tableName = 'doctor_invitations';

@Unique('DOCTOR_INVITATIONS_EMAIL_UQ', ['email'])
@Entity({ name: tableName })
export class DoctorInvitation extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @BeforeInsert()
  updateEmail() {
    this.email = this.email.toLowerCase();
  }

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'uuid', nullable: true })
  hospitalId?: string;

  @ManyToOne(() => Hospital, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;
}
