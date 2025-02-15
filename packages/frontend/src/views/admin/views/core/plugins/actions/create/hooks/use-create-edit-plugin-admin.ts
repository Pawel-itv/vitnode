import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { mutationCreateApi } from './mutation-create-api';
import { mutationEditApi } from './mutation-edit-api';
import { useDialog } from '@/components/ui/dialog';
import { usePathname, useRouter } from '@/navigation';
import { useSessionAdmin } from '@/hooks/use-session-admin';
import { FetcherErrorType } from '@/graphql/fetcher';
import { ShowAdminPlugins } from '@/graphql/types';

export const codePluginRegex = /^[a-z0-9-]*$/;

interface Args {
  data?: ShowAdminPlugins;
}

export const useCreateEditPluginAdmin = ({ data }: Args) => {
  const t = useTranslations('admin.core.plugins');
  const tCore = useTranslations('core');
  const { setOpen } = useDialog();
  const pathname = usePathname();
  const { push } = useRouter();
  const { session } = useSessionAdmin();

  const formSchema = z.object({
    name: z
      .string()
      .min(3)
      .max(50)
      .default(data?.name ?? ''),
    description: z
      .string()
      .default(data?.description ?? '')
      .optional(),
    code: z
      .string()
      .min(3)
      .max(50)
      .refine(value => codePluginRegex.test(value), {
        message: t('create.code.invalid'),
      })
      .default(data?.code ?? ''),
    support_url: z
      .string()
      .url()
      .default(data?.support_url ?? ''),
    author: z
      .string()
      .min(3)
      .max(100)
      .default(data ? data.author : (session?.name ?? '')),
    author_url: z
      .string()
      .url()
      .or(z.literal(''))
      .default(data?.author_url ?? '')
      .optional(),
  });

  const onSubmit = async (
    values: z.infer<typeof formSchema>,
    form: UseFormReturn<z.infer<typeof formSchema>>,
  ) => {
    let error: FetcherErrorType | null = null;

    if (data) {
      const mutation = await mutationEditApi({
        name: values.name,
        code: values.code,
        description: values.description,
        supportUrl: values.support_url,
        author: values.author,
        authorUrl: values.author_url,
        default: data.default,
      });

      if (mutation?.error) {
        error = mutation.error;
      }
    } else {
      const mutation = await mutationCreateApi({
        name: values.name,
        code: values.code,
        description: values.description,
        supportUrl: values.support_url,
        author: values.author,
        authorUrl: values.author_url,
      });

      if (mutation?.error) {
        error = mutation.error;
      }
    }

    if (error) {
      if (error?.extensions?.code === 'PLUGIN_ALREADY_EXISTS') {
        form.setError('code', {
          message: t('create.code.exists'),
        });

        return;
      }

      toast.error(tCore('errors.title'), {
        description: tCore('errors.internal_server_error'),
      });

      return;
    }

    toast.success(t(data ? 'edit.success' : 'create.success'), {
      description: values.name,
    });

    if (!data) {
      push(pathname);
      setOpen?.(false);
    }
  };

  return {
    formSchema,
    onSubmit,
  };
};
