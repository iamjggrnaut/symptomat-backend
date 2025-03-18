import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSymptomatPatientDto } from './dto/create-symptomat-patient.dto';
import { UpdateSymptomatPatientDto } from './dto/update-symptomat-patient.dto';
import { SymptomatPatient } from './sp.entity';

@Injectable()
export class SymptomatPatientsService {
  constructor(
    @InjectRepository(SymptomatPatient)
    private readonly symptomatPatientsRepository: Repository<SymptomatPatient>,
  ) {}

  // Создание нового пациента
  async create(createSymptomatPatientDto: CreateSymptomatPatientDto): Promise<SymptomatPatient> {
    const patient = this.symptomatPatientsRepository.create(createSymptomatPatientDto);
    return await this.symptomatPatientsRepository.save(patient);
  }

  // Получение всех пациентов
  async findAll(): Promise<SymptomatPatient[]> {
    return await this.symptomatPatientsRepository.find();
  }

  // Получение одного пациента по ID
  async findOne(id: string): Promise<SymptomatPatient> {
    const patient = await this.symptomatPatientsRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  // Обновление данных пациента
  async update(id: string, updateSymptomatPatientDto: UpdateSymptomatPatientDto): Promise<SymptomatPatient> {
    const patient = await this.findOne(id);
    const updatedPatient = this.symptomatPatientsRepository.merge(patient, updateSymptomatPatientDto);
    return await this.symptomatPatientsRepository.save(updatedPatient);
  }

  // Удаление пациента
  async remove(id: string): Promise<void> {
    const result = await this.symptomatPatientsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }
}
