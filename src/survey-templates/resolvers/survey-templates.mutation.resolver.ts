import { UseInterceptors } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { SentryInterceptor } from 'src/common/interceptors';

@UseInterceptors(
  new SentryInterceptor({
    filters: {
      fromStatus: 500,
    },
  }),
)
@Resolver()
export class SurveyTemplatesMutationResolver {}
