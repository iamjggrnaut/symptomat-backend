import { OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { Admin } from 'src/admins/admin.entity';
import { AuthRefreshToken, AuthToken } from 'src/auth/auth.types';

export class AdminsSignInBodyDto {
  @IsString()
  @Length(0, 254)
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @Length(0, 254)
  password: string;
}

export class AdminDto extends OmitType(Admin, ['password', 'hashPasswordBeforeInsert', 'hashPasswordBeforeUpdate']) {}

export class AuthAdminDto {
  user: AdminDto;
  token: AuthToken;
  refreshToken: AuthRefreshToken;
}
