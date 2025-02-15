import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { Metadata } from 'next';

import { ContentDevicesSettings } from './content';
import { CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { fetcher } from '@/graphql/fetcher';
import { redirect } from '@/navigation';
import {
  Core_Sessions__Devices__Show,
  Core_Sessions__Devices__ShowQuery,
  Core_Sessions__Devices__ShowQueryVariables,
} from '@/graphql/queries/settings/core_sessions__devices__show.generated';

const getData = async () => {
  const data = await fetcher<
    Core_Sessions__Devices__ShowQuery,
    Core_Sessions__Devices__ShowQueryVariables
  >({
    query: Core_Sessions__Devices__Show,
  });

  return data;
};

export const generateMetadataDevicesSettings = async (): Promise<Metadata> => {
  const t = await getTranslations('core.settings.devices');

  return {
    title: t('title'),
    description: t('desc'),
  };
};

export const DevicesSettingsView = async () => {
  const [t, data] = await Promise.all([
    getTranslations('core.settings.devices'),
    getData(),
  ]);
  const cookieStore = cookies();
  const loginToken = cookieStore.get('vitnode-login-token')?.value;
  if (!loginToken) return redirect('/login');

  return (
    <>
      <CardHeader>
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          {t('title')}
        </h1>
        <CardDescription>{t('desc')}</CardDescription>
      </CardHeader>

      <CardContent>
        <ContentDevicesSettings {...data} loginToken={loginToken} />
      </CardContent>
    </>
  );
};
