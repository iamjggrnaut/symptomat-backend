import { Injectable } from '@nestjs/common';
import { PushNotificationsService } from '@purrweb/firebase';
import { Survey } from 'src/surveys/entities';

@Injectable()
export class PatientPushNotificationsService {
  constructor(private readonly pushNotificationsService: PushNotificationsService) {}

  sendNewSurvey(survey: Survey) {
    const topic = `push-notifications-${survey.patientId}`;
    this.pushNotificationsService.sendToTopic(
      topic,
      {
        title: 'Новый опрос',
        body: `Вам пришел новый опрос "${survey.template.title}"`,
      },
      { payload: JSON.stringify(survey) },
    );
  }
}
