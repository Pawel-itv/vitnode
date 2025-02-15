import { join } from 'path';

import { CodegenConfig } from '@graphql-codegen/cli';

export const codegenConfig = ({
  config,
  pathOutGql,
}: {
  pathOutGql: string;
  config?: Omit<CodegenConfig, 'generates'>;
}): CodegenConfig => {
  return {
    ...config,
    schema: `${process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:8080'}/graphql`,
    documents: [
      ...(Array.isArray(config?.documents) ? config.documents : []),
      join(process.cwd(), '..', 'frontend', 'plugins/**/graphql/**/*.gql'),
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
    generates: {
      [`${join(pathOutGql, 'types.ts')}`]: {
        plugins: ['typescript'],
      },
      [pathOutGql]: {
        preset: 'near-operation-file',
        presetConfig: { extension: '.generated.ts', baseTypesPath: 'types.ts' },
        plugins: ['typescript-operations', 'typescript-document-nodes'],
      },
    },
  };
};
