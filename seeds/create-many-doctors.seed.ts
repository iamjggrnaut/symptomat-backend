import { Doctor } from 'src/doctors/entities';
import { Hospital, HospitalsDoctors } from 'src/hospitals/entities';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateManyDoctorsEntities implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const hospital = await factory(Hospital)().create();
    const doctors = await factory(Doctor)().createMany(100);
    const doctorIds = doctors.map((item) => item.id);
    Promise.all([this.createHospitalsDoctors(factory, doctorIds, hospital.id)]);
  }

  public async createHospitalsDoctors(factory: Factory, doctorIds: string[], hospitalId: string) {
    return Promise.all(
      doctorIds.map((doctorId) =>
        factory(HospitalsDoctors)().create({
          hospitalId,
          doctorId,
        }),
      ),
    );
  }
}
