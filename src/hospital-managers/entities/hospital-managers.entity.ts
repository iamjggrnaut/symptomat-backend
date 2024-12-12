import crypto from 'crypto';

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsUUID } from 'class-validator';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Base } from '../../common/entities/base.entity';
import { UsersRole } from '../../common/types/users.types';
import { Hospital } from '../../hospitals/entities';

const tableName = 'hospital_managers';

@Unique('HOSPITAL_MANAGERS_EMAIL_UQ', ['email'])
@Entity({ name: tableName })
export class HospitalManager extends Base {
  static tableName = tableName;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @IsDefined()
  @IsEmail()
  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text', select: false })
  password: string;

  @BeforeInsert()
  updateEmail() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  hashPasswordBeforeInsert() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }

  @ManyToOne(() => Hospital, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;

  @ApiProperty()
  @IsDefined()
  @IsUUID()
  @Column({ type: 'uuid' })
  hospitalId: string;

  @Column({ type: 'enum', enum: UsersRole, default: UsersRole.MANAGER })
  role: UsersRole;
}
