import { Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { ShowAdminPlugins } from '@/graphql/types';

export const UploadPluginActionsAdmin = (
  props: Pick<ShowAdminPlugins, 'code' | 'name'>,
) => {
  const t = useTranslations('core');

  const Content = React.lazy(async () =>
    import('../../upload/upload').then(module => ({
      default: module.UploadPluginAdmin,
    })),
  );

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                ariaLabel={t('upload_new_version')}
              >
                <Upload />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{t('upload_new_version')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="max-w-xl">
        <React.Suspense fallback={<Loader />}>
          <Content data={props} />
        </React.Suspense>
      </DialogContent>
    </Dialog>
  );
};
