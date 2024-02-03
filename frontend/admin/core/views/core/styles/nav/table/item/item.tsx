import { useSortable } from '@dnd-kit/sortable';
import { Menu } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';

import { cx } from '@/functions/classnames';
import { Button } from '@/components/ui/button';
import type { ShowCoreNav } from '@/graphql/hooks';
import { useTextLang } from '@/hooks/core/use-text-lang';

interface Props extends Omit<ShowCoreNav, '__typename'> {
  depth: boolean;
  isDropHere: boolean;
}

export const ItemContentTableContentNavAdmin = ({
  depth,
  description,
  id,
  isDropHere,
  name
}: Props) => {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    animateLayoutChanges: ({ isSorting, wasDragging }) => (isSorting || wasDragging ? false : true)
  });
  const { convertText } = useTextLang();

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition
      }}
      className={cx(
        'p-4 flex gap-4 bg-card items-center transition-[background-color,opacity] relative border',
        {
          'opacity-50 z-10': isDragging,
          [`ml-5`]: depth,
          'animate-pulse bg-primary/20': isDropHere
        }
      )}
    >
      <Button
        className="sm:flex hidden flex-shrink-0 focus:outline-none text-muted-foreground hover:text-foreground cursor-grab"
        variant="ghost"
        size="icon"
        tooltip=""
        {...attributes}
        {...listeners}
      >
        <Menu />
      </Button>

      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <span className="font-semibold">{convertText(name)}</span>
        </div>

        {description.length > 0 && (
          <span className="text-muted-foreground text-sm line-clamp-2">
            {convertText(description)}
          </span>
        )}
      </div>

      <div>actions</div>
    </div>
  );
};
