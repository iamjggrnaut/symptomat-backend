import { Hospital } from "src/hospitals/entities";
import { define } from "typeorm-seeding"
import Faker from 'faker';

define(Hospital, (faker: typeof Faker) => {
    const hospital = new Hospital();
    hospital.name = faker.name.title()
    return hospital;
  });
  