import * as Lucide from "lucide-react";
import { useTranslations } from "next-intl";

import { IconDynamic, type IconDynamicNames } from "@/components/icon-dynamic";
import type { IconInputProps } from "../content";
import { Button } from "@/components/ui/button";

interface Props extends IconInputProps {
  search: string;
}

const iconNamesArray = Object.keys(Lucide.icons) as IconDynamicNames[];

export const IconsContentIconInput = ({
  onChange,
  search,
  setOpen,
  value
}: Props) => {
  const t = useTranslations("core.icon_picker.icons");
  const data = iconNamesArray.filter(name =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  if (data.length === 0) {
    return <span className="text-muted-foreground">{t("not_found")}</span>;
  }

  return (
    <>
      {data.slice(0, 42).map(name => (
        <Button
          key={name}
          size="icon"
          tooltip={name}
          variant={value === name ? "default" : "ghost"}
          onClick={() => {
            if (value === name) {
              onChange("");
              setOpen(false);

              return;
            }

            onChange(name);
            setOpen(false);
          }}
        >
          <IconDynamic name={name} />
        </Button>
      ))}
    </>
  );
};
