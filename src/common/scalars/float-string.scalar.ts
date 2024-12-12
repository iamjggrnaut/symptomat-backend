import { CustomScalar, Scalar } from '@nestjs/graphql';
import { GraphQLError, Kind, ValueNode } from 'graphql';
import { isNumber } from 'lodash';

export class FloatString {}

@Scalar('FloatString', () => FloatString)
export class FloatStringScalar implements CustomScalar<number, number> {
  description = 'A string or number represents float';

  parseValue(value: string | number): number {
    const parsedValue = Number(value);
    if (!isNumber(parsedValue)) {
      throw new GraphQLError('string is not UUID v4');
    }
    return parsedValue; // value from the client
  }

  serialize(value: string | number): number {
    return Number(value); // value sent to the client
  }

  parseLiteral(ast: ValueNode): number {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT || ast.kind === Kind.FLOAT) {
      const value = Number(ast.value);
      if (!isNumber(value)) {
        throw new GraphQLError('value is not float string or float');
      }
      return value;
    }
    throw new GraphQLError('value is not float string or float');
  }
}
