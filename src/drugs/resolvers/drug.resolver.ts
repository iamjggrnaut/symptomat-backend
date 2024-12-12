import { Resolver } from '@nestjs/graphql';

import { DrugModel } from '../models';

@Resolver(() => DrugModel)
export class DrugResolver {}
