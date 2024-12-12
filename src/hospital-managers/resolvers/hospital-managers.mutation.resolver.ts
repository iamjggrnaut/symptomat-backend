import { UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { SentryInterceptor } from '../../common/interceptors';
import { BasePayload } from '../../common/payloads';
import { HospitalManagerEmailSignInInput } from '../inputs/manager-email-signin.input';
import { HospitalManagerEmailSignInPayload } from '../payloads/hospital-manager-email-singin.payload';
import { HospitalManagerEmailAuthService } from '../services/hospital-managers-email-auth.service';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class HospitalManagerMutationResolver {
  constructor(private readonly emailAuthService: HospitalManagerEmailAuthService) {}

  @Mutation(() => HospitalManagerEmailSignInPayload, {
    description: 'Sign-in with email retrive user with bearer token',
  })
  hospitalManagerEmailSignIn(
    @Args({ name: 'input', type: () => HospitalManagerEmailSignInInput })
    input: HospitalManagerEmailSignInInput,
  ) {
    return BasePayload.catchProblems(HospitalManagerEmailSignInPayload, async () => {
      return HospitalManagerEmailSignInPayload.create(
        await this.emailAuthService.signIn({ email: input.email, password: input.password }),
      );
    });
  }
}
