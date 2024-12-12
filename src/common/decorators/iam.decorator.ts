import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Doctor } from 'src/doctors/entities';
import { HospitalManager } from 'src/hospital-managers/entities/hospital-managers.entity';
import { Patient } from 'src/patients/entities/patient.entity';

export const IAM = createParamDecorator(
  (data: keyof (Patient | HospitalManager | Doctor), context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const ctx = GqlExecutionContext.create(context);
    if (!request && !ctx) return null;
    const user = request ? request.user : ctx.getContext().req.user;
    return data ? user[data] : user;
  },
);
