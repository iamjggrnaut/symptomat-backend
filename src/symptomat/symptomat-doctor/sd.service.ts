import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSymptomatDoctorDto } from './dto/create-symptomat-doctor.dto';
import { UpdateSymptomatDoctorDto } from './dto/update-symptomat-doctor.dto';
import { SymptomatDoctor } from './sd.entity';

@Injectable()
export class SymptomatDoctorsService {
  constructor(
    @InjectRepository(SymptomatDoctor)
    private readonly symptomatDoctorsRepository: Repository<SymptomatDoctor>,
  ) {}

  async create(createSymptomatDoctorDto: CreateSymptomatDoctorDto): Promise<SymptomatDoctor> {
    const doctor = this.symptomatDoctorsRepository.create(createSymptomatDoctorDto);
    return await this.symptomatDoctorsRepository.save(doctor);
  }

  async findAll(): Promise<SymptomatDoctor[]> {
    return await this.symptomatDoctorsRepository.find();
  }

  async findOne(id: string): Promise<SymptomatDoctor> {
    const doctor = await this.symptomatDoctorsRepository.findOne({ where: { id } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async update(id: string, updateSymptomatDoctorDto: UpdateSymptomatDoctorDto): Promise<SymptomatDoctor> {
    const doctor = await this.findOne(id);
    const updatedDoctor = this.symptomatDoctorsRepository.merge(doctor, updateSymptomatDoctorDto);
    return await this.symptomatDoctorsRepository.save(updatedDoctor);
  }

  async remove(id: string): Promise<void> {
    const result = await this.symptomatDoctorsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
  }
}
