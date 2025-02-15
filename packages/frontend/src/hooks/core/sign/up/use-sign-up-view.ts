import { useTranslations } from 'next-intl';
import * as z from 'zod';
import React from 'react';
import { toast } from 'sonner';
import { UseFormReturn } from 'react-hook-form';

import { mutationApi } from './mutation-api';

import { useCaptcha } from '../../../use-captcha';

const nameRegex = /^(?!.* {2})[\p{L}\p{N}._@ -]*$/u;

export const useSignUpView = () => {
  const t = useTranslations('core');
  const [successName, setSuccessName] = React.useState('');
  const [values, setValues] = React.useState<
    Partial<z.infer<typeof formSchema>>
  >({});
  const { getTokenFromCaptcha, isReady } = useCaptcha();

  const formSchema = z.object({
    name: z
      .string()
      .min(3)
      .max(32, {
        message: t('forms.max_length', { length: 32 }),
      })
      .refine(value => nameRegex.test(value), {
        message: t('sign_up.form.name.invalid'),
      })
      .default(''),
    email: z.string().email().default(''),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/,
        {
          message: t('sign_up.form.password.invalid'),
        },
      )
      .default(''),
    terms: z
      .boolean()
      .refine(value => value, {
        message: t('sign_up.form.terms.empty'),
      })
      .default(false),
    newsletter: z.boolean().default(false).optional(),
  });

  const onSubmit = async (
    values: z.infer<typeof formSchema>,
    form: UseFormReturn<z.infer<typeof formSchema>>,
  ) => {
    const token = await getTokenFromCaptcha();
    if (!token) {
      toast.error(t('errors.title'), {
        description: t('errors.captcha_empty'),
      });

      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { terms, ...rest } = values;
    const mutation = await mutationApi({ ...rest, token });

    if (mutation?.error.extensions) {
      const { code } = mutation.error.extensions;

      if (code === 'CAPTCHA_FAILED') {
        toast.error(t('errors.title'), {
          description: t('errors.captcha_failed'),
        });

        return;
      }

      if (code === 'EMAIL_ALREADY_EXISTS') {
        form.setError(
          'email',
          {
            type: 'manual',
            message: t('sign_up.form.email.already_exists'),
          },
          {
            shouldFocus: true,
          },
        );

        return;
      }

      if (code === 'NAME_ALREADY_EXISTS') {
        form.setError(
          'name',
          {
            type: 'manual',
            message: t('sign_up.form.name.already_exists'),
          },
          {
            shouldFocus: true,
          },
        );

        return;
      }

      toast.error(t('errors.title'), {
        description: t('errors.internal_server_error'),
      });

      return;
    }

    setSuccessName(values.name);
  };

  return {
    values,
    setValues,
    formSchema,
    onSubmit,
    isReady,
    successName,
  };
};
