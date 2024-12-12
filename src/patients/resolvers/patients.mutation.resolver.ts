import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/auth/decorators';
import { JwtAuthGuard, UserRoleGuard } from 'src/auth/guards';
import { IAM } from 'src/common/decorators';
import { SentryInterceptor } from 'src/common/interceptors';
import { BasePayload } from 'src/common/payloads/base/base-payload';
import { ValidPasswordPipe } from 'src/common/pipes';

import { UsersRole } from '../../common/types/users.types';
import {
  PatientAssignToDoctorPayload,
  PatientCheckRecoveryCodePayload,
  PatientCreatePasswordPayload,
  PatientCreatePayload,
  PatientEmailPasswordRecoveryPayload,
  PatientEmailPasswordRecoverySendCodePayload,
  PatientEmailSignInPayload,
  PatientEmailUpdatePayload,
  PatientEmailUpdateSendPasswordPayload,
  PatientFcmTokenUpdatePayload,
  PatientPasswordUpdatePayload,
  PatientRemovePayload,
  PatientSendContactMeRequestPayload,
  PatientUpdateLanguagePayload,
  PatientUpdateNotificationsPayload,
} from './../payloads';
import { Patient } from '../entities/patient.entity';
import { PatientHospitalLimitGuard, PatientInviteLifetimeGuard, PatientSignUpGuard } from '../guards';
import {
  PatientAssignToDoctorInput,
  PatientCheckRecoveryCodeInput,
  PatientCreateInput,
  PatientCreatePasswordInput,
  PatientEmailPasswordRecoveryInput,
  PatientEmailPasswordRecoverySendCodeInput,
  PatientEmailSignInInput,
  PatientEmailUpdateSendCodeInput,
  PatientFcmTokenUpdateInput,
  PatientPasswordUpdateInput,
  PatientUpdateLanguageInput,
  PatientUpdateNotificationsInput,
} from '../inputs';
import { PatientModel } from '../models';
import { PatientEmailAuthService, PatientsService } from '../services';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class PatientsMutationResolver {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly emailAuthService: PatientEmailAuthService,
  ) {}

  @UseGuards(JwtAuthGuard, UserRoleGuard, PatientSignUpGuard, PatientHospitalLimitGuard)
  @UserRoles(UsersRole.DOCTOR)
  @Mutation(() => PatientCreatePayload, {
    description: 'Create patient and send temp password to email',
  })
  async patientCreate(
    @Args({ name: 'input', type: () => PatientCreateInput })
    input: PatientCreateInput,
    @IAM('id') doctorId: string,
  ) {
    return BasePayload.catchProblems(PatientCreatePayload, async () => {
      return PatientCreatePayload.create({
        password: await this.emailAuthService.sendPasswordForSignUp(doctorId, input),
      });
    });
  }

  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard, PatientInviteLifetimeGuard)
  @Mutation(() => PatientCreatePasswordPayload, {
    description: 'Create password for patient retrive patient with bearer token',
  })
  patientCreatePassword(
    @Args({ name: 'input', type: () => PatientCreatePasswordInput }, ValidPasswordPipe)
    input: PatientCreatePasswordInput,
    @IAM('id') patientId: string,
  ) {
    return BasePayload.catchProblems(PatientCreatePasswordPayload, async () => {
      return PatientCreatePasswordPayload.create(await this.emailAuthService.createPassword(patientId, input.password));
    });
  }

  @UserRoles(UsersRole.DOCTOR)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @Mutation(() => PatientAssignToDoctorPayload, {
    description: 'Assign patient to doctor',
  })
  patientAssignToDoctor(
    @Args({ name: 'input', type: () => PatientAssignToDoctorInput })
    input: PatientAssignToDoctorInput,
    @IAM('id') doctorId: string,
  ) {
    return BasePayload.catchProblems(PatientAssignToDoctorPayload, async () => {
      return PatientAssignToDoctorPayload.create({
        success: await this.patientsService.assignToDoctor(doctorId, input.patientId),
      });
    });
  }

  @Mutation(() => PatientEmailSignInPayload, {
    description: 'Sign-in with email retrive user with bearer token',
  })
  patientEmailSignIn(
    @Args({ name: 'input', type: () => PatientEmailSignInInput })
    input: PatientEmailSignInInput,
  ) {
    return BasePayload.catchProblems(PatientEmailSignInPayload, async () => {
      return PatientEmailSignInPayload.create(await this.emailAuthService.signIn(input));
    });
  }

  @Mutation(() => PatientEmailPasswordRecoverySendCodePayload, {
    description: 'Send code to change password and retrieve code',
  })
  patientEmailRecoveryPasswordSendCode(
    @Args({ name: 'input', type: () => PatientEmailPasswordRecoverySendCodeInput })
    input: PatientEmailPasswordRecoverySendCodeInput,
  ) {
    return BasePayload.catchProblems(PatientEmailPasswordRecoverySendCodePayload, async () => {
      return PatientEmailPasswordRecoverySendCodePayload.create({
        code: await this.emailAuthService.sendPasswordRecoveryCode(input.email),
      });
    });
  }

  @Mutation(() => PatientCheckRecoveryCodePayload, {
    description: 'Check recovery code',
  })
  patientCheckRecoveryCode(
    @Args({ name: 'input', type: () => PatientCheckRecoveryCodeInput })
    input: PatientCheckRecoveryCodeInput,
  ) {
    return BasePayload.catchProblems(PatientCheckRecoveryCodePayload, async () => {
      return PatientCheckRecoveryCodePayload.create({
        success: await this.emailAuthService.checkRecoveryCode(input),
      });
    });
  }

  @Mutation(() => PatientEmailPasswordRecoveryPayload, {
    description: 'Change password and retrieve patient',
  })
  patientRecoverPassword(
    @Args({ name: 'input', type: () => PatientEmailPasswordRecoveryInput }, ValidPasswordPipe)
    input: PatientEmailPasswordRecoveryInput,
  ) {
    return BasePayload.catchProblems(PatientEmailPasswordRecoveryPayload, async () => {
      return PatientEmailPasswordRecoveryPayload.create({
        success: await this.emailAuthService.recoverPassword(input),
      });
    });
  }

  @Mutation(() => PatientFcmTokenUpdatePayload, {
    description: 'Update patient firebase token',
  })
  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async patientFcmTokenUpdate(
    @IAM() patient: Patient,
    @Args({ name: 'input', type: () => PatientFcmTokenUpdateInput })
    input: PatientFcmTokenUpdateInput,
  ) {
    return BasePayload.catchProblems(PatientFcmTokenUpdatePayload, async () => {
      return PatientFcmTokenUpdatePayload.create({
        user: await this.patientsService.patchFcmToken(patient.id, input),
      });
    });
  }

  @Mutation(() => PatientEmailUpdateSendPasswordPayload, {
    description: 'Send code for update email',
  })
  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  patientEmailUpdateSendCode(
    @Args({ name: 'input', type: () => PatientEmailUpdateSendCodeInput })
    input: PatientEmailUpdateSendCodeInput,
  ) {
    return BasePayload.catchProblems(PatientEmailUpdateSendPasswordPayload, async () => {
      return PatientEmailUpdateSendPasswordPayload.create(
        await this.emailAuthService.emailRecoveryPasswordSendCode(input.email),
      );
    });
  }

  @Mutation(() => PatientEmailUpdatePayload, {
    description: 'Update my email',
  })
  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  patientEmailUpdate(
    @Args({ name: 'input', type: () => PatientEmailSignInInput })
    input: PatientEmailSignInInput,
    @IAM('email')
    currentEmail: string,
  ) {
    return BasePayload.catchProblems(PatientEmailUpdatePayload, async () => {
      return PatientEmailUpdatePayload.create(await this.emailAuthService.changeEmail(currentEmail, input.email));
    });
  }

  @Mutation(() => PatientPasswordUpdatePayload, {
    description: 'Update password',
  })
  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  patientPasswordUpdate(
    @Args({ name: 'input', type: () => PatientPasswordUpdateInput }, ValidPasswordPipe)
    input: PatientPasswordUpdateInput,
    @IAM()
    patient: Patient,
  ) {
    return BasePayload.catchProblems(PatientPasswordUpdatePayload, async () => {
      return PatientPasswordUpdatePayload.create(
        await this.patientsService.updatePassword(patient.id, input.oldPassword, input.password),
      );
    });
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.DOCTOR)
  @Mutation(() => PatientRemovePayload, {
    description: 'Remove patient by id',
  })
  patientRemove(@Args('id') patientId: string) {
    return BasePayload.catchProblems(PatientRemovePayload, async () => {
      return PatientRemovePayload.create({
        success: await this.patientsService.removePatient(patientId),
      });
    });
  }

  @Mutation(() => PatientUpdateNotificationsPayload, {
    description: 'Update notification settings',
  })
  @UserRoles(UsersRole.PATIENT)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  async patientUpdateNotificationsSettings(
    @Args({ name: 'input', type: () => PatientUpdateNotificationsInput })
    input: PatientUpdateNotificationsInput,
    @IAM()
    patient: Patient,
  ) {
    return PatientUpdateNotificationsPayload.create({
      user: PatientModel.create(
        await this.patientsService.updateOne(patient.id, {
          notificationsSettings: {
            newSurvey: input.newSurveyNotifications,
          },
        }),
      ),
    });
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.PATIENT)
  @Mutation(() => PatientUpdateLanguagePayload, {
    description: 'Change language',
  })
  async patientUpdateLanguage(
    @IAM('id') id: string,
    @Args({ name: 'input', type: () => PatientUpdateLanguageInput })
    input: PatientUpdateLanguageInput,
  ) {
    return PatientUpdateLanguagePayload.create({
      user: await this.patientsService.updateOne(id, {
        language: input.language,
      }),
    });
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UsersRole.PATIENT)
  @Mutation(() => PatientSendContactMeRequestPayload, {
    description: 'Send contact me request to doctor',
  })
  patientSendContactMeRequest(
    @IAM('id') patientId: string,
    @Args('doctorId') doctorId: string,
    @Args('message') message: string,
  ) {
    return BasePayload.catchProblems(PatientSendContactMeRequestPayload, async () => {
      return PatientSendContactMeRequestPayload.create({
        success: await this.patientsService.sendContactMeRequest(patientId, doctorId, message),
      });
    });
  }
}
