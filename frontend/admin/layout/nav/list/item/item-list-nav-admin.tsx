import { LucideIcon, ChevronDown } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/components/ui/button';
import { cx } from '@/functions/classnames';
import { LinkItemListNavAdmin } from './link/link-item-list-nav-admin';
import { usePathname } from '@/i18n';

interface Props {
  activeItem: string;
  icon: LucideIcon;
  id: string;
  items: {
    href: string;
    id: string;
  }[];
  setActiveItem: Dispatch<SetStateAction<string>>;
  onClickItem?: () => void;
}

export const ItemListNavAdmin = ({
  activeItem,
  icon,
  id,
  items,
  onClickItem,
  setActiveItem
}: Props) => {
  const Icon = icon;
  const pathname = usePathname();
  const pathnameId = pathname.split('/').at(2);
  const t = useTranslations('admin');

  return (
    <Accordion.Item value={id}>
      <Accordion.Header>
        <Accordion.Trigger
          className={cx(
            'w-full justify-start flex gap-2',
            buttonVariants({ variant: id === pathnameId ? 'default' : 'ghost' }),
            {
              'font-semibold': id === pathnameId
            }
          )}
          onClick={() => setActiveItem(id)}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-expect-error */}
          <span>{t(`nav.${id}.title`)}</span>
          <ChevronDown
            className={cx('w-5 h-5 ml-auto transition-transform flex-shrink-0', {
              'transform rotate-180': id === activeItem
            })}
          />
        </Accordion.Trigger>
      </Accordion.Header>

      <Accordion.Content className="transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
        <ul className="py-2">
          {items.map(el => (
            <LinkItemListNavAdmin
              key={el.id}
              href={`/admin/${id}${el.href}`}
              id={el.id}
              primaryId={id}
              onClick={onClickItem}
            />
          ))}
        </ul>
      </Accordion.Content>
    </Accordion.Item>
  );
};
