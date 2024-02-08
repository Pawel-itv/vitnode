import { Virtuoso } from "react-virtuoso";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
  type UniqueIdentifier
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { ItemTableForumsForumAdmin } from "./item/item";
import { useForumForumsAdminAPI } from "./hooks/use-forum-forums-admin-api";
import {
  buildTree,
  flattenTree,
  getForumProjection,
  removeChildrenOf
} from "./functions";
import type {
  Admin__Forum_Forums__ShowFlattenedItem,
  Admin__Forum_Forums__ShowWithProjection
} from "./types";
import { Loader } from "@/components/loader/loader";
import { ErrorAdminView } from "@/admin/core/global/error-admin-view";
import { APIKeys } from "@/graphql/api-keys";
import type { Admin__Forum_Forums__ShowQuery } from "@/graphql/hooks";
import { mutationChangePositionApi } from "./hooks/mutation-change-position-api";

const indentationWidth = 20;

export const ContentTableForumsForumAdmin = () => {
  const t = useTranslations("core");
  const { data, fetchNextPage, hasNextPage, isError, isLoading } =
    useForumForumsAdminAPI();
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [projected, setProjected] =
    useState<Admin__Forum_Forums__ShowWithProjection | null>();
  const [isOpenChildren, setIsOpenChildren] = useState<UniqueIdentifier[]>([]);

  const resetState = () => {
    setOverId(null);
    setActiveId(null);
    setProjected(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // DndKit doesn't support nested sortable, so we need to flatten the data in one array
  const flattenedItems: Admin__Forum_Forums__ShowFlattenedItem[] =
    useMemo(() => {
      const tree = flattenTree(data);

      const collapsedItems = tree.reduce<UniqueIdentifier[]>(
        (acc, { children, id }) =>
          !isOpenChildren.includes(id) && children?.length ? [...acc, id] : acc,
        []
      );

      return removeChildrenOf({
        items: tree,
        ids: activeId ? [activeId, ...collapsedItems] : collapsedItems
      });
    }, [data, activeId, isOpenChildren]);

  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems]
  );

  if (isLoading) return <Loader />;
  if (isError) return <ErrorAdminView />;
  if (!data || data.length === 0)
    return <div className="text-center">{t("no_results")}</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always
        }
      }}
      onDragCancel={resetState}
      onDragOver={({ over }) => setOverId(over?.id ?? null)}
      onDragMove={({ delta }) => {
        if (!activeId || !overId) return;

        const currentProjection = getForumProjection(
          flattenedItems,
          activeId,
          overId,
          delta.x,
          indentationWidth
        );

        if (projected?.parentId === currentProjection.parentId) {
          return;
        }

        setProjected(currentProjection);
      }}
      onDragStart={({ active: { id: activeId } }) => {
        setActiveId(activeId);
        setOverId(activeId);
      }}
      onDragEnd={async ({ active, over }) => {
        resetState();

        if (!projected || !over) return;
        const { depth, parentId } = projected;
        const clonedItems: Admin__Forum_Forums__ShowFlattenedItem[] =
          JSON.parse(JSON.stringify(flattenTree(data)));

        const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
        const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
        const activeTreeItem = clonedItems[activeIndex];
        clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };
        const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
        const findItemsParent = sortedItems.filter(
          i => i.parentId === parentId
        );

        // Update position of the item
        findItemsParent.forEach((item, index) => {
          const findIndex = sortedItems.findIndex(i => i.id === item.id);

          if (!findIndex) return;

          sortedItems[findIndex] = {
            ...item,
            position: index
          };
        });

        queryClient.setQueryData<InfiniteData<Admin__Forum_Forums__ShowQuery>>(
          [APIKeys.FORUMS_ADMIN],
          old => {
            const lastPage = old?.pages.at(-1);
            if (!old || !lastPage) return old;

            return {
              pages: [
                {
                  ...lastPage,
                  admin__forum_forums__show: {
                    ...lastPage.admin__forum_forums__show,
                    edges: buildTree(sortedItems)
                  }
                }
              ],
              pageParams: [old.pageParams.at(-1)]
            };
          }
        );

        // -1 means that the item is the last one
        const findActive = flattenedItems.find(i => i.id === active.id);
        if (!findActive) return;

        // If change item position on the same level at the end of the list
        if (active.id === over.id && depth < findActive.depth) {
          const findParentPosition = flattenedItems.find(
            i => i.id === findActive.parentId
          )?.position;

          if (findParentPosition === undefined) return;

          await mutationChangePositionApi({
            id: Number(active.id),
            parentId,
            indexToMove: findParentPosition + 1
          });

          return;
        }

        const indexToMove =
          active.id === over.id
            ? -1
            : flattenedItems.find(i => i.id === over.id)?.position ?? -1;

        // Do nothing if drag and drop on the same item on the same level
        if (findActive?.parentId === parentId && active.id === over.id) {
          return;
        }

        await mutationChangePositionApi({
          id: Number(active.id),
          parentId,
          indexToMove
        });
      }}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        <Virtuoso
          useWindowScroll
          data={flattenedItems}
          overscan={200}
          className="rounded-md"
          endReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          itemContent={(_index, item) => {
            return (
              <ItemTableForumsForumAdmin
                key={item.id}
                indentationWidth={indentationWidth}
                onCollapse={id => {
                  setIsOpenChildren(prev => {
                    if (prev.includes(id)) {
                      return prev.filter(i => i !== id);
                    }

                    return [...prev, id];
                  });
                }}
                isOpenChildren={isOpenChildren.includes(item.id)}
                isDropHere={projected?.parentId === item.id}
                {...item}
              />
            );
          }}
        />
      </SortableContext>
    </DndContext>
  );
};
