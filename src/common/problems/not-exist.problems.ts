import { ObjectType } from '@nestjs/graphql';
import { EntityPayload } from 'src/common/payloads/base/entity-payload';

@ObjectType()
export class NotExistEmailProblem extends EntityPayload.BaseProblem {
  constructor(message = 'not exists email') {
    super(message);
  }
}

@ObjectType()
export class NotExistDoctorProblem extends EntityPayload.BaseProblem {
  constructor(message = 'not exists doctor') {
    super(message);
  }
}

@ObjectType()
export class NotExistPatientProblem extends EntityPayload.BaseProblem {
  constructor(message = 'not exists patient') {
    super(message);
  }
}

@ObjectType()
export class NotExistQuestionProblem extends EntityPayload.BaseProblem {
  constructor(message = 'not exists question') {
    super(message);
  }
}

@ObjectType()
export class NotExistQuestionCategoryProblem extends EntityPayload.BaseProblem {
  constructor(message = 'not exists question category') {
    super(message);
  }
}

@ObjectType()
export class NotExistAnalyzeProblem extends EntityPayload.BaseProblem {
  constructor(message = 'not exists analyze') {
    super(message);
  }
}

@ObjectType()
export class NotExistNotificationProblem extends EntityPayload.BaseProblem {
  constructor(message = 'not exists notification') {
    super(message);
  }
}
