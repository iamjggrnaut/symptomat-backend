import { CustomScalar, Scalar } from '@nestjs/graphql';
import { isUUID } from 'class-validator';
import { GraphQLError, Kind, ValueNode } from 'graphql';

export class UUID {}

@Scalar('UUID', () => UUID)
export class UUIDScalar implements CustomScalar<string, string> {
  description = 'A string represents string UUID v4';

  parseValue(value: string): string {
    if (!isUUID(value, '4')) {
      throw new GraphQLError('string is not UUID v4');
    }
    return value; // value from the client
  }

  serialize(value: string): string {
    return value; // value sent to the client
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING) {
      if (!isUUID(ast.value, '4')) {
        throw new GraphQLError('string is not in UUID v4 format ex. 123e4567-e89b-12d3-a456-426614174000');
      }
      return ast.value;
    }
    throw new GraphQLError('string is not in UUID v4 format');
  }
}
