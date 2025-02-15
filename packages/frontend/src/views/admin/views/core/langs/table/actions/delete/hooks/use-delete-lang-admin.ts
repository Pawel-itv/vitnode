import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { mutationApi } from './mutation-api';
import { useAlertDialog } from '@/components/ui/alert-dialog';
import { usePathname, useRouter } from '@/navigation';
import { ShowCoreLanguages } from '@/graphql/types';

export const useDeleteLangAdmin = ({
  code,
  name,
}: Pick<ShowCoreLanguages, 'code' | 'name'>) => {
  const t = useTranslations('admin.core.langs.actions.delete');
  const tCore = useTranslations('core');
  const { setOpen } = useAlertDialog();
  const pathname = usePathname();
  const { push } = useRouter();
  const formSchema = z.object({
    name: z.string().refine(value => value === name),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.name !== name) return;
    const mutation = await mutationApi({ code });
    if (mutation?.error) {
      toast.error(tCore('errors.title'), {
        description: tCore('errors.internal_server_error'),
      });

      return;
    }

    push(pathname);

    toast.success(t('success'), {
      description: name,
    });

    setOpen(false);
  };

  return { onSubmit, formSchema };
};
