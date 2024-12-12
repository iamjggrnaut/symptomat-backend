import { HospitalPatientType } from 'src/hospitals/repositories/hospitals-patients.repository';

import {
  PatientPressureHistoryItemModel,
  PatientPulseHistoryItemModel,
  PatientTemperatureHistoryItemModel,
  PatientWeightHistoryItemModel,
} from './models';

interface BasePatientCursor {
  take: number;
  startAt?: Date;
  endAt?: Date;
}

export interface WeightCursor extends BasePatientCursor {
  lastWeight: Pick<PatientWeightHistoryItemModel, 'createdAt'>;
}

export interface PulseCursor extends BasePatientCursor {
  lastPulse: Pick<PatientPulseHistoryItemModel, 'createdAt'>;
}

export interface TemperatureCursor extends BasePatientCursor {
  lastTemperature: Pick<PatientTemperatureHistoryItemModel, 'createdAt'>;
}

export interface PressureCursor extends BasePatientCursor {
  lastPressure: Pick<PatientPressureHistoryItemModel, 'createdAt'>;
}

export interface PatientCursor {
  lastPatient: Pick<HospitalPatientType, 'rowNumber'>;
  take: number;
}
