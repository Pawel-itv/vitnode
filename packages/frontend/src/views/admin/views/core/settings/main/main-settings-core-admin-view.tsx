import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

import { ContentMainSettingsCoreAdmin } from './content';
import { HeaderContent } from '@/components/ui/header-content';
import { Card } from '@/components/ui/card';
import { fetcher } from '@/graphql/fetcher';
import {
  Core_Main_Settings__Show,
  Core_Main_Settings__ShowQuery,
  Core_Main_Settings__ShowQueryVariables,
} from '@/graphql/queries/admin/settings/core_main_settings__show.generated';

const getData = async () => {
  const data = await fetcher<
    Core_Main_Settings__ShowQuery,
    Core_Main_Settings__ShowQueryVariables
  >({
    query: Core_Main_Settings__Show,
  });

  return data;
};

export const generateMetadataMainSettingsCoreAdmin =
  async (): Promise<Metadata> => {
    const t = await getTranslations('core.admin.nav');

    return {
      title: t('settings_general'),
    };
  };

export const MainSettingsCoreAdminView = async () => {
  const [t, data] = await Promise.all([
    getTranslations('core.admin.nav'),
    getData(),
  ]);

  return (
    <>
      <HeaderContent h1={t('settings_general')} />

      <Card className="p-6">
        <ContentMainSettingsCoreAdmin {...data} />
      </Card>
    </>
  );
};
