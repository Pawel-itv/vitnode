import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

import { mutationApi } from './mutation-api';
import { UploadPluginAdminProps } from '../upload';
import { useDialog } from '@/components/ui/dialog';
import { ErrorType } from '@/graphql/fetcher';

export const useUploadPluginAdmin = ({ data }: UploadPluginAdminProps) => {
  const t = useTranslations('admin.core.plugins.upload');
  const tCore = useTranslations('core');
  const { setOpen } = useDialog();
  const formSchema = z.object({
    file: z.array(z.instanceof(File)),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      file: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.file.length) return;

    const formData = new FormData();
    formData.append('file', values.file[0]);
    if (data) {
      formData.append('code', data.code);
    }

    try {
      const mutation = await mutationApi(formData);

      toast.success(t(data ? 'success_update' : 'success'), {
        description: mutation.admin__core_plugins__upload.name,
      });
    } catch (err) {
      const error = err as ErrorType;

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

    setOpen?.(false);
  };

  return { form, onSubmit };
};
