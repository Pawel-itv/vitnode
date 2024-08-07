import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { editMutationApi } from './edit-mutation-api';
import { createMutationApi } from './create-mutation-api';
import { useDialog } from '@/components/ui/dialog';
import { ShowCoreLanguages } from '@/graphql/types';

interface Args {
  data?: ShowCoreLanguages;
}

export const useCreateEditLangAdmin = ({ data }: Args) => {
  const t = useTranslations('admin.core.langs.actions');
  const tCore = useTranslations('core');
  const { setOpen } = useDialog();

  const formSchema = z.object({
    code: z.string().min(1),
    name: z.string().min(1),
    timezone: z.string().min(1),
    default: z.boolean(),
    time_24: z.boolean(),
    locale: z.string(),
    allow_in_input: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: data?.code ?? '',
      name: data?.name ?? '',
      timezone: data?.timezone ?? 'America/New_York',
      default: data?.default ?? false,
      time_24: data?.time_24 ?? false,
      locale: data?.locale ?? 'en',
      allow_in_input: data?.allow_in_input ?? true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let isError = false;

    if (data) {
      const mutation = await editMutationApi({
        ...data,
        ...values,
        time24: values.time_24,
        allowInInput: values.allow_in_input,
      });

      if (mutation?.error) {
        isError = true;
      }
    } else {
      const mutation = await createMutationApi({
        ...values,
        time24: values.time_24,
        allowInInput: values.allow_in_input,
      });

      if (mutation?.error) {
        isError = true;
      }
    }

    if (isError) {
      toast.error(tCore('errors.title'), {
        description: tCore('errors.internal_server_error'),
      });

      return;
    }

    toast(t(data ? 'edit.success' : 'create.success'), {
      description: values.name,
    });
    setOpen?.(false);
  };

  return {
    form,
    onSubmit,
  };
};
