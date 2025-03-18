import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { CreateSymptomatPatientDto } from './dto/create-symptomat-patient.dto';
import { UpdateSymptomatPatientDto } from './dto/update-symptomat-patient.dto';
import { SymptomatPatientsService } from './sp.service';

@Controller('patients')
export class SymptomatPatientsController {
  constructor(private readonly symptomatPatientsService: SymptomatPatientsService) {}

  @Post()
  create(@Body() createSymptomatPatientDto: CreateSymptomatPatientDto) {
    return this.symptomatPatientsService.create(createSymptomatPatientDto);
  }

  @Get()
  findAll() {
    return this.symptomatPatientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.symptomatPatientsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSymptomatPatientDto: UpdateSymptomatPatientDto) {
    return this.symptomatPatientsService.update(id, updateSymptomatPatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.symptomatPatientsService.remove(id);
  }
}
