import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';

import { CreateSymptomatDoctorDto } from './dto/create-symptomat-doctor.dto';
import { UpdateSymptomatDoctorDto } from './dto/update-symptomat-doctor.dto';
import { SymptomatDoctor } from './sd.entity';
import { SymptomatDoctorsService } from './sd.service';

@Controller('doctors')
export class SymptomatDoctorsController {
  constructor(private readonly symptomatDoctorsService: SymptomatDoctorsService) {}

  // Создание нового врача
  @Post()
  async create(@Body() createSymptomatDoctorDto: CreateSymptomatDoctorDto): Promise<SymptomatDoctor> {
    return this.symptomatDoctorsService.create(createSymptomatDoctorDto);
  }

  // Получение всех врачей
  @Get()
  async findAll(): Promise<SymptomatDoctor[]> {
    return this.symptomatDoctorsService.findAll();
  }

  // Получение одного врача по ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SymptomatDoctor> {
    const doctor = await this.symptomatDoctorsService.findOne(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  // Обновление данных врача
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSymptomatDoctorDto: UpdateSymptomatDoctorDto,
  ): Promise<SymptomatDoctor> {
    return this.symptomatDoctorsService.update(id, updateSymptomatDoctorDto);
  }

  // Удаление врача
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.symptomatDoctorsService.remove(id);
  }
}
