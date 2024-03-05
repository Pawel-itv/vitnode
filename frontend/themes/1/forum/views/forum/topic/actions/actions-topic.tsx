import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LockToggleActionsTopic } from "./lock-toggle/lock-toggle";

interface Props {
  id: number;
  state: {
    locked: boolean;
  };
}

export const ActionsTopic = ({ id, state }: Props) => {
  const t = useTranslations("forum.topics.actions");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" ariaLabel={t("title")}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <LockToggleActionsTopic id={id} locked={state.locked} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
