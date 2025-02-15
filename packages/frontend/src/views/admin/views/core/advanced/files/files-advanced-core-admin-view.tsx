import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

import { ContentFilesAdvancedCoreAdminView } from './content';
import {
  SearchParamsPagination,
  getPaginationTool,
} from '@/graphql/get-pagination-tool';
import { HeaderContent } from '@/components/ui/header-content';
import { Card } from '@/components/ui/card';
import { fetcher } from '@/graphql/fetcher';
import {
  Admin__Core_Files__Show,
  Admin__Core_Files__ShowQuery,
  Admin__Core_Files__ShowQueryVariables,
} from '@/graphql/queries/admin/advanced/files/admin__core_files__show.generated';
import { ShowCoreFilesSortingColumnEnum } from '@/graphql/types';

const getData = async (variables: Admin__Core_Files__ShowQueryVariables) => {
  const data = await fetcher<
    Admin__Core_Files__ShowQuery,
    Admin__Core_Files__ShowQueryVariables
  >({
    query: Admin__Core_Files__Show,
    variables,
  });

  return data;
};

export interface FilesAdvancedCoreAdminViewProps {
  searchParams: SearchParamsPagination;
}

export const generateMetadataFilesAdvancedCoreAdmin =
  async (): Promise<Metadata> => {
    const t = await getTranslations('admin.core.advanced.files');

    return {
      title: t('title'),
    };
  };

export const FilesAdvancedCoreAdminView = async ({
  searchParams,
}: FilesAdvancedCoreAdminViewProps) => {
  const variables = getPaginationTool({
    searchParams,
    defaultPageSize: 10,
    sortByEnum: ShowCoreFilesSortingColumnEnum,
  });

  const [t, data] = await Promise.all([
    getTranslations('admin.core.advanced.files'),
    getData(variables),
  ]);

  return (
    <>
      <HeaderContent h1={t('title')} />

      <Card className="p-6">
        <ContentFilesAdvancedCoreAdminView {...data} />
      </Card>
    </>
  );
};
