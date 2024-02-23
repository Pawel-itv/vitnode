"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWrapperCategoryForum } from "@/hooks/forums/forum/use-wrapper-category-forum";
import { LOCAL_STORAGE_KEY } from "./wrapper";

interface Props {
  id: number;
}

export const ChevronCategoryForumButton = ({ id }: Props) => {
  const { open, setOpen } = useWrapperCategoryForum();

  return (
    <Button
      className="text-muted-foreground hover:text-foreground flex-shrink-0 [&[data-state=open]>svg]:rotate-180 [&>svg]:transition-transform"
      variant="ghost"
      size="icon"
      data-state={open ? "open" : "closed"}
      tooltip=""
      onClick={() => {
        setOpen(prev => !prev);
        const currentId = id.toString();

        const prevIds =
          localStorage.getItem(LOCAL_STORAGE_KEY)?.split(",") || [];
        const valueToSet = prevIds.includes(currentId)
          ? prevIds.filter(i => i !== currentId)
          : [...prevIds, currentId];

        localStorage.setItem(LOCAL_STORAGE_KEY, valueToSet.join(","));
      }}
    >
      <ChevronDown />
    </Button>
  );
};
