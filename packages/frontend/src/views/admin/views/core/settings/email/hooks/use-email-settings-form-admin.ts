import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { mutationApi } from './mutation-api';
import { Admin__Core_Email_Settings__ShowQuery } from '@/graphql/queries/admin/settings/admin__core_email_settings__show.generated';
import { getHSLFromString, isColorBrightness } from '@/helpers/colors';

export const useEmailSettingsFormAdmin = ({
  admin__core_email_settings__show: data,
}: Admin__Core_Email_Settings__ShowQuery) => {
  const t = useTranslations('core');

  const formSchema = z
    .object({
      provider: z.enum(['none', 'smtp', 'resend']),
      smtp: z.object({
        host: z.string(),
        user: z.string(),
        port: z.number().int().min(1).max(999),
        secure: z.boolean(),
        password: z.string(),
      }),
      resend_key: z.string(),
      color_primary: z.string(),
    })
    .refine(input => {
      if (input.provider === 'smtp') {
        return input.smtp.host !== '' && input.smtp.user !== '';
      }

      return true;
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: 'none',
      smtp: {
        host: data.smtp_host || '',
        user: data.smtp_user || '',
        port: data.smtp_port || 1,
        secure: data.smtp_secure || false,
        password: '', // Password is not fetched from the server,
      },
      resend_key: '',
      color_primary: data.color_primary || 'hsl(0, 0, 0)',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const primaryHSL = getHSLFromString(values.color_primary);
    if (!primaryHSL) return;

    const mutation = await mutationApi({
      smtpHost: values.smtp_host,
      smtpUser: values.smtp_user,
      smtpPort: values.smtp_port,
      smtpSecure: values.smtp_secure,
      smtpPassword: values.smtp_password,
      colorPrimary: values.color_primary,
      colorPrimaryForeground: `hsl(${isColorBrightness(primaryHSL) ? `${primaryHSL.h}, 40%, 2%` : `${primaryHSL.h}, 40%, 98%`})`,
    });

    if (mutation?.error) {
      toast.error(t('errors.title'), {
        description: t('errors.internal_server_error'),
      });

      return;
    }

    toast.success(t('saved_success'));
    form.reset(values);
  };

  return { form, onSubmit };
};
