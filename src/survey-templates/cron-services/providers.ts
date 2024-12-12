import { Provider } from '@nestjs/common';
import { SurveyTemplatesCronEveryDayService } from 'src/survey-templates/cron-services/survey-templates-cron-every-day.service';

const SURVEY_CRON_PROVIDER_NAME = 'SURVEY_CRON_PROVIDER';

export const cronProviders: Provider[] = [
  {
    provide: SURVEY_CRON_PROVIDER_NAME,
    useClass: SurveyTemplatesCronEveryDayService,
  },
];
