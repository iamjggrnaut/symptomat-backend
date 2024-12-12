import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminsRepository } from 'src/admins/admin.repository';

@Injectable()
export class AdminProfileService {
  constructor(
    @InjectRepository(AdminsRepository)
    private readonly adminsRepository: AdminsRepository,
  ) {}

  async emailIsUniq(email: string): Promise<boolean> {
    const admin = await this.adminsRepository.findOne({
      where: {
        email,
      },
      select: ['id'],
    });
    return !admin;
  }
}
