import { CustomScalar, Scalar } from '@nestjs/graphql';
import { GraphQLError, Kind, ValueNode } from 'graphql';

@Scalar('URL')
export class URLScalar implements CustomScalar<string, URL> {
  description = 'URL custom scalar type';

  parseValue(value: string): URL {
    return new URL(value.toString());
  }

  serialize(value: URL): string {
    return new URL(value.toString()).toString();
  }

  parseLiteral(ast: ValueNode): URL {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Can only validate strings as URLs but got a: ${ast.kind}`);
    }

    return new URL(ast.value.toString());
  }
}
