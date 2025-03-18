import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { IAM } from 'src/common/decorators';
import { ValidPasswordPipe } from 'src/common/pipes';
import { UsersRole } from 'src/common/types/users.types';

import { UserRoles } from '../../auth/decorators';
import { SentryInterceptor } from '../../common/interceptors';
import { BasePayload } from '../../common/payloads';
import { Doctor } from '../entities';
import {
  DoctorEmailPasswordRecoveryInput,
  DoctorEmailPasswordRecoverySendLinkInput,
  DoctorEmailSignInInput,
  DoctorEmailSignUpInput,
  DoctorEmailSignUpSendLinkInput,
  DoctorPasswordUpdateInput,
  DoctorRemoveByIdInput,
  DoctorUpdateLanguageInput,
  DoctorUpdateNotificationsInput,
} from '../inputs';
import { DoctorModel } from '../models/doctor.model';
import {
  DoctorEmailPasswordRecoveryPayload,
  DoctorEmailPasswordRecoverySendLinkPayload,
  DoctorEmailSignInPayload,
  DoctorEmailSignUpPayload,
  DoctorEmailSignUpSendCodePayload,
  DoctorPasswordUpdatePayload,
  DoctorRemoveByIdPayload,
  DoctorUpdateLanguagePayload,
  DoctorUpdateNotificationsPayload,
} from '../payloads';
import { UpdatePasswordPipe } from '../pipes';
import { DoctorEmailAuthService } from '../services/doctor-email-auth.service';
import { DoctorService } from '../services/doctor.service';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class DoctorsMutationResolver {
  constructor(
    private readonly emailAuthService: DoctorEmailAuthService,
    private readonly doctorService: DoctorService,
  ) {}

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.MANAGER)
  @Mutation(() => DoctorEmailSignUpSendCodePayload, {
    description: 'Send code to email for sign-in with email',
  })
  async doctorEmailSignUpSendCode(
    @Args({ name: 'input', type: () => DoctorEmailSignUpSendLinkInput })
    input: DoctorEmailSignUpSendLinkInput,
    @IAM('id') hospitalManagerId: string,
  ) {
    return BasePayload.catchProblems(DoctorEmailSignUpSendCodePayload, async () => {
      return DoctorEmailSignUpSendCodePayload.create({
        hash: await this.emailAuthService.sendSignUpLink(hospitalManagerId, input.email),
      });
    });
  }

  @Mutation(() => DoctorEmailSignUpSendCodePayload, {
    description: 'Send code to email for sign-in with email',
  })
  async doctorSelfEmailSignUp(
    @Args({ name: 'input', type: () => DoctorEmailSignUpSendLinkInput })
    input: DoctorEmailSignUpSendLinkInput,
  ) {
    return BasePayload.catchProblems(DoctorEmailSignUpSendCodePayload, async () => {
      return DoctorEmailSignUpSendCodePayload.create({
        hash: await this.emailAuthService.doctorSelfSignUpLink(input.email),
      });
    });
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.DOCTOR)
  @Mutation(() => DoctorUpdateLanguagePayload, {
    description: 'Change language',
  })
  async doctorUpdateLanguage(
    @IAM('id') id: string,
    @Args({ name: 'input', type: () => DoctorUpdateLanguageInput })
    input: DoctorUpdateLanguageInput,
  ) {
    return DoctorUpdateLanguagePayload.create({
      user: await this.doctorService.updateOne(id, {
        language: input.language,
      }),
    });
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.MANAGER)
  @Mutation(() => DoctorRemoveByIdPayload, {
    description: 'Remove doctor by id',
  })
  doctorRemoveById(
    @Args({ name: 'input', type: () => DoctorRemoveByIdInput })
    input: DoctorRemoveByIdInput,
  ) {
    return BasePayload.catchProblems(DoctorRemoveByIdPayload, async () => {
      return DoctorRemoveByIdPayload.create({
        success: await this.doctorService.removeDoctorById(input.doctorId),
      });
    });
  }

  @Mutation(() => DoctorEmailSignUpPayload, {
    description: 'Sign-up doctor with email and retrieve user with bearer token',
  })
  doctorEmailSignUp(
    @Args({ name: 'input', type: () => DoctorEmailSignUpInput }, ValidPasswordPipe)
    input: DoctorEmailSignUpInput,
  ) {
    return BasePayload.catchProblems(DoctorEmailSignUpPayload, async () => {
      return DoctorEmailSignUpPayload.create(await this.emailAuthService.signUp(input));
    });
  }

  @Mutation(() => DoctorEmailSignInPayload, {
    description: 'Sign-in with email retrive user with bearer token',
  })
  doctorEmailSignIn(
    @Args({ name: 'input', type: () => DoctorEmailSignInInput })
    input: DoctorEmailSignInInput,
  ) {
    return BasePayload.catchProblems(DoctorEmailSignInPayload, async () => {
      return DoctorEmailSignInPayload.create(
        await this.emailAuthService.signIn({ email: input.email, password: input.password }),
      );
    });
  }

  @Mutation(() => DoctorEmailPasswordRecoverySendLinkPayload, {
    description: 'Send link to change password and retrieve hash',
  })
  doctorEmailRecoveryPasswordSendLink(
    @Args({ name: 'input', type: () => DoctorEmailPasswordRecoverySendLinkInput })
    input: DoctorEmailPasswordRecoverySendLinkInput,
  ) {
    return BasePayload.catchProblems(DoctorEmailPasswordRecoverySendLinkPayload, async () => {
      return DoctorEmailPasswordRecoverySendLinkPayload.create({
        hash: await this.emailAuthService.sendPasswordRecoveryLink(input.email),
      });
    });
  }

  @Mutation(() => DoctorEmailPasswordRecoveryPayload, {
    description: 'Change password and retrieve doctor',
  })
  doctorRecoverPassword(
    @Args({ name: 'input', type: () => DoctorEmailPasswordRecoveryInput }, ValidPasswordPipe)
    input: DoctorEmailPasswordRecoveryInput,
  ) {
    return BasePayload.catchProblems(DoctorEmailPasswordRecoveryPayload, async () => {
      return DoctorEmailPasswordRecoveryPayload.create({
        success: await this.emailAuthService.recoverPassword(input),
      });
    });
  }

  @Mutation(() => DoctorPasswordUpdatePayload, {
    description: 'Update password',
  })
  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  doctorPasswordUpdate(
    @Args({ name: 'input', type: () => DoctorPasswordUpdateInput }, UpdatePasswordPipe)
    input: DoctorPasswordUpdateInput,
    @IAM()
    doctor: Doctor,
  ) {
    return BasePayload.catchProblems(DoctorPasswordUpdatePayload, async () => {
      return DoctorPasswordUpdatePayload.create(
        await this.doctorService.updatePassword(doctor.id, input.password, input.newPassword),
      );
    });
  }

  @Mutation(() => DoctorUpdateNotificationsPayload, {
    description: 'Update notification settings',
  })
  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async doctorUpdateNotificationsSettings(
    @Args({ name: 'input', type: () => DoctorUpdateNotificationsInput })
    input: DoctorUpdateNotificationsInput,
    @IAM()
    doctor: Doctor,
  ) {
    return DoctorUpdateNotificationsPayload.create({
      user: DoctorModel.create(
        await this.doctorService.updateOne(doctor.id, {
          notificationsSettings: {
            contactMeRequest: input.contactMeRequestNotifications,
            uploadAnalyzesByPatients: input.uploadAnalyzesByPatientsNotifications,
            criticalIndicators: input.criticalIndicatorsNotifications,
          },
        }),
      ),
    });
  }
}
