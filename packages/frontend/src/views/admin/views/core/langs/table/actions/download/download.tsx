import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { ShowCoreLanguages } from '@/graphql/types';

const Content = React.lazy(async () =>
  import('./content').then(module => ({
    default: module.ContentDownloadActionsTableLangsCoreAdmin,
  })),
);

export const DownloadActionsTableLangsCoreAdmin = (
  props: Pick<ShowCoreLanguages, 'code'>,
) => {
  const t = useTranslations('core');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" ariaLabel={t('download')}>
          <Download />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <React.Suspense fallback={<Loader />}>
          <Content {...props} />
        </React.Suspense>
      </DialogContent>
    </Dialog>
  );
};
