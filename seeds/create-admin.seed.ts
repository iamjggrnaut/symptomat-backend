import { Admin } from 'src/admins/admin.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateAdmin implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Admin)().create({
      email: 'admin@survey.com',
      password: 'admin@survey.com',
    });
  }
}
