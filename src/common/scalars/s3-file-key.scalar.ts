import { CustomScalar, Scalar } from '@nestjs/graphql';
import { GraphQLError, Kind, ValueNode } from 'graphql';
import { getFileExt } from 'src/utils';

@Scalar('S3FileKey')
export class S3FileKeyScalar implements CustomScalar<string, string> {
  description = 'Amazon S3 custom scalar type';

  parseValue(value: string): string {
    const ext = getFileExt(value);
    if (!ext) {
      throw new GraphQLError(`Invalid fileKey value: ${value}, extension must be presented`);
    }
    return value;
  }

  serialize(value: string): string {
    return value.toString();
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Can only validate strings as S3FileKey but got ${ast.kind}`);
    }
    return ast.value.toString();
  }
}
