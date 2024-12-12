import Faker from 'faker';
import { Admin } from 'src/admins/admin.entity';
import { define } from 'typeorm-seeding';

const DEFUALT_ADMIN_PASSWORD = 'passworDd0';

define(Admin, (faker: typeof Faker) => {
  const admin = new Admin();

  admin.email = faker.internet.email();
  admin.password = DEFUALT_ADMIN_PASSWORD;
  admin.firstName = faker.name.firstName();
  admin.lastName = faker.name.lastName();

  return admin;
});
