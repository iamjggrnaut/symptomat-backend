import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { HospitalManagersRepository } from 'src/hospital-managers/repository/hospital-managers.repository';

@Injectable()
export class UniqManagersEmailGuard implements CanActivate {
  constructor(private readonly managerRepository: HospitalManagersRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const email = req.body['email'];
    const id = req.params['id'];
    const managerWithEmail = await this.managerRepository.findOne({ where: { email }, select: ['id'] });

    if (managerWithEmail && managerWithEmail.id !== id) {
      throw new BadRequestException(`Manager ${email} already exist!`);
    }

    return true;
  }
}
