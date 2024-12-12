import Faker from 'faker';
import { Doctor } from 'src/doctors/entities';
import { define } from 'typeorm-seeding';

define(Doctor, (faker: typeof Faker) => {
  const doctor = new Doctor();

  doctor.email = faker.internet.email();
  doctor.password = doctor.email;

  return doctor;
});
