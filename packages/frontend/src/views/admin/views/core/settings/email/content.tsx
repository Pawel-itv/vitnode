'use client';

import { useTranslations } from 'next-intl';
import { SquareArrowOutUpRight } from 'lucide-react';

import { useEmailSettingsFormAdmin } from './hooks/use-email-settings-form-admin';
import { Separator } from '@/components/ui/separator';
import { Admin__Core_Email_Settings__ShowQuery } from '@/graphql/queries/admin/settings/admin__core_email_settings__show.generated';
import { Link } from '@/navigation';
import { AutoForm } from '@/components/ui/auto-form';
import { AutoFormRadioGroup } from '@/components/ui/auto-form/fields/radio-group';
import { AutoFormColor } from '@/components/ui/auto-form/fields/color';
import { AutoFormFile } from '@/components/ui/auto-form/fields/file';
import { AutoFormInput } from '@/components/ui/auto-form/fields/input';
import { AutoFormSwitch } from '@/components/ui/auto-form/fields/switch';
import { AutoFormInputComponentProps } from '@/components/ui/auto-form/type';

export const ContentEmailSettingsAdmin = (
  props: Admin__Core_Email_Settings__ShowQuery,
) => {
  const t = useTranslations('admin.core.settings.email');
  const { onSubmit, formSchema } = useEmailSettingsFormAdmin(props);

  return (
    <AutoForm
      theme="horizontal"
      formSchema={formSchema}
      onSubmit={onSubmit}
      fieldConfig={{
        color_primary: {
          label: t('color_primary'),
          fieldType: AutoFormColor,
        },
        logo: {
          label: t('logo'),
          fieldType: props => (
            <AutoFormFile
              acceptExtensions={['png', 'jpg', 'gif']}
              maxFileSizeInMb={2}
              accept="image/png, image/gif, image/jpeg"
              showInfo
              {...props}
            />
          ),
        },
        provider: {
          label: t('provider.title'),
          fieldType: props => (
            <>
              <div className="w-full space-y-2">
                <Separator />
              </div>

              <AutoFormRadioGroup
                labels={{
                  none: {
                    title: t('provider.none'),
                  },
                  smtp: {
                    title: t('provider.smtp'),
                  },
                  resend: {
                    title: t('provider.resend'),
                    description: t.rich('provider.resend_desc', {
                      link: text => (
                        <Link
                          href="https://resend.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          {text}
                          <SquareArrowOutUpRight className="size-3" />
                        </Link>
                      ),
                    }),
                  },
                }}
                {...props}
              />
            </>
          ),
        },
        smtp: {
          host: {
            label: t('smtp_host'),
            fieldType: (props: AutoFormInputComponentProps) => (
              <AutoFormInput placeholder="smtp.gmail.com" {...props} />
            ),
          },
          user: {
            label: t('smtp_user'),
            fieldType: (props: AutoFormInputComponentProps) => (
              <AutoFormInput placeholder="user" {...props} />
            ),
          },
          password: {
            label: t('smtp_password'),
            fieldType: (props: AutoFormInputComponentProps) => (
              <AutoFormInput
                type="password"
                placeholder="**********"
                {...props}
              />
            ),
          },
          secure: {
            label: t('smtp_secure'),
            fieldType: AutoFormSwitch,
          },
          port: {
            label: t('smtp_port'),
            fieldType: (props: AutoFormInputComponentProps) => (
              <AutoFormInput type="number" {...props} />
            ),
          },
        },
        resend_key: {
          label: t('resend_key'),
          fieldType: props => (
            <AutoFormInput
              type="password"
              placeholder="**********"
              {...props}
            />
          ),
        },
      }}
    />
  );
};
