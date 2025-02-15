import { useTranslations } from 'next-intl';

import { useDeleteLangAdmin } from './hooks/use-delete-lang-admin';
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ShowCoreLanguages } from '@/graphql/types';
import { AutoForm } from '@/components/form/auto-form';
import { AutoFormInput } from '@/components/form/fields/input';

export const ContentDeleteActionsTableLangsCoreAdmin = ({
  code,
  name,
}: Pick<ShowCoreLanguages, 'code' | 'name'>) => {
  const t = useTranslations('admin.core.langs.actions.delete');
  const tCore = useTranslations('core');
  const { onSubmit, formSchema } = useDeleteLangAdmin({ name, code });

  return (
    <AlertDialogHeader>
      <AlertDialogTitle>{tCore('are_you_absolutely_sure')}</AlertDialogTitle>
      <AlertDialogDescription className="flex flex-col gap-4">
        <p>{t('text')}</p>
        <p>
          {t.rich('form_confirm_text', {
            text: () => (
              <span className="text-foreground font-semibold">{name}</span>
            ),
          })}
        </p>
      </AlertDialogDescription>

      <AutoForm
        formSchema={formSchema}
        onSubmit={onSubmit}
        submitButton={props => (
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline">
                {tCore('cancel')}
              </Button>
            </AlertDialogCancel>

            <Button variant="destructive" {...props}>
              {t('submit')}
            </Button>
          </AlertDialogFooter>
        )}
        fieldConfig={{
          name: {
            fieldType: AutoFormInput,
          },
        }}
      />
    </AlertDialogHeader>
  );
};
