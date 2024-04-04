import {
  DndContext,
  closestCorners,
  DragOverlay,
  MeasuringStrategy,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { useTranslations } from "next-intl";

import { ItemTableForumsForumAdmin } from "./item/item";
import {
  useForumForumsAdminAPI,
  type ShowForumForumsAdminWithChildren
} from "./hooks/use-forum-forums-admin-api";
import { mutationChangePositionApi } from "./hooks/mutation-change-position-api";
import { useDragAndDrop } from "@/hooks/core/drag&drop/use-functions";
import { ItemDragAndDrop } from "@/hooks/core/drag&drop/item";

const indentationWidth = 20;

export interface TableForumsForumAdminProps {
  initData: ShowForumForumsAdminWithChildren[];
}

export const ContentTableForumsForumAdmin = ({
  initData
}: TableForumsForumAdminProps) => {
  const t = useTranslations("core");
  const { data, setData, updateData } = useForumForumsAdminAPI({ initData });
  const {
    actionsItem,
    activeItemOverlay,
    flattenedItems,
    onDragEnd,
    onDragMove,
    onDragOver,
    onDragStart,
    resetState,
    sortedIds
  } = useDragAndDrop<ShowForumForumsAdminWithChildren>({ data });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  if (!data || data.length === 0) {
    return <div className="text-center">{t("no_results")}</div>;
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      sensors={sensors}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always
        }
      }}
      onDragCancel={resetState}
      onDragOver={onDragOver}
      onDragMove={e => onDragMove({ ...e, flattenedItems, indentationWidth })}
      onDragStart={onDragStart}
      onDragEnd={async ({ active, over, ...rest }) => {
        const moveTo = onDragEnd<ShowForumForumsAdminWithChildren>({
          active,
          over,
          data,
          setData,
          ...rest
        });

        if (!moveTo) return;

        await mutationChangePositionApi(moveTo);
      }}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {flattenedItems.map(item => (
          <ItemDragAndDrop
            key={item.id}
            {...actionsItem({
              data: item,
              onCollapse: ({ isOpen }) => {
                if (!isOpen) {
                  updateData({ parentId: item.id });
                }
              },
              indentationWidth
            })}
          >
            <ItemTableForumsForumAdmin data={item} />
          </ItemDragAndDrop>
        ))}

        <DragOverlay>
          {activeItemOverlay && (
            <ItemDragAndDrop
              {...actionsItem({
                data: activeItemOverlay
              })}
            >
              <ItemTableForumsForumAdmin data={activeItemOverlay} />
            </ItemDragAndDrop>
          )}
        </DragOverlay>
      </SortableContext>
    </DndContext>
  );
};
