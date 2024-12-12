import { registerEnumType } from '@nestjs/graphql';

export enum UsersRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

registerEnumType(UsersRole, {
  name: 'PatientRole',
});

export enum Language {
  RU = 'ru',
  EN = 'en',
  KZ = 'kz',
  DE = 'de',
}

registerEnumType(Language, {
  name: 'Language',
});

export enum SearchOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SearchOrder, {
  name: 'SearchOrder',
});
