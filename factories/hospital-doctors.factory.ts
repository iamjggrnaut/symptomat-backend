import { HospitalsDoctors } from "src/hospitals/entities";
import { define } from "typeorm-seeding"

define(HospitalsDoctors, () => {
    const hd = new HospitalsDoctors();
    return hd;
  });
  