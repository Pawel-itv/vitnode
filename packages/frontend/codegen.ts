import { join } from 'path';

import { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenv from 'dotenv';

dotenv.config({
  path: join(process.cwd(), '..', '..', '.env'),
});

const config: CodegenConfig = {
  overwrite: true,
  schema: `${process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:8080'}/graphql`,
  documents: [join(process.cwd(), '..', 'frontend', 'src/graphql/**/*.gql')],
  generates: {
    ['./src/graphql/graphql.ts']: {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
      config: {
        maybeValue: 'T',
        scalars: {
          DateTime: 'Date',
          Upload: 'File',
        },
        enumsAsConst: true,
        allowEnumStringTypes: true,
        namingConvention: {
          enumValues: 'change-case-all#lowerCase',
        },
      },
    },
  },
};

export default config;
