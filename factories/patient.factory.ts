import Faker from 'faker';
import { Patient } from 'src/patients/entities/patient.entity';
import { define } from 'typeorm-seeding';

define(Patient, (faker: typeof Faker) => {
  const patient = new Patient();

  patient.email = faker.internet.email();
  patient.password = patient.email;

  return patient;
});
