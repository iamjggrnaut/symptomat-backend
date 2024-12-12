import { Field, ObjectType } from '@nestjs/graphql';

import { UsersRole } from '../types/users.types';

@ObjectType()
export abstract class UsersModelBase {
  @Field(() => String)
  id: string;

  protected constructor(data: Partial<UsersModelBase>) {
    Object.assign(this, data);
  }

  @Field({ nullable: true })
  email?: string;

  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @Field(() => UsersRole, { nullable: true })
  role: UsersRole;
}
