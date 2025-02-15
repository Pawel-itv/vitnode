import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

import { mutationApi } from './mutation-api';
import { UploadPluginAdminProps } from '../upload';
import { useDialog } from '@/components/ui/dialog';
import { FetcherErrorType } from '@/graphql/fetcher';
import { zodFile } from '@/helpers/zod';

export const useUploadPluginAdmin = ({ data }: UploadPluginAdminProps) => {
  const t = useTranslations('admin.core.plugins.upload');
  const tCore = useTranslations('core');
  const { setOpen } = useDialog();
  const formSchema = z.object({
    file: zodFile,
  });

  const onSubmit = async (
    values: z.infer<typeof formSchema>,
    form: UseFormReturn<z.infer<typeof formSchema>>,
  ) => {
    if (!values.file || !(values.file instanceof File)) return;

    const formData = new FormData();
    formData.append('file', values.file);
    if (data) {
      formData.append('code', data.code);
    }

    const mutation = await mutationApi(formData);

    if (!mutation.data || mutation.error) {
      const error = mutation.error as FetcherErrorType;

      if (
        error.extensions?.code === 'PLUGIN_ALREADY_EXISTS' ||
        error.extensions?.code === 'PLUGIN_VERSION_IS_LOWER'
      ) {
        form.setError('file', {
          message: t(`errors.${error?.extensions?.code}`),
        });

        return;
      }

      toast.error(tCore('errors.title'), {
        description: tCore('errors.internal_server_error'),
      });

      return;
    }

    toast.success(t(data ? 'success_update' : 'success'), {
      description: mutation.data.admin__core_plugins__upload.name,
    });

    setOpen?.(false);
  };

  return { onSubmit, formSchema };
};
