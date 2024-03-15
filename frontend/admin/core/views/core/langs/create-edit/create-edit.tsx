import { useTranslations } from "next-intl";
import { Virtuoso } from "react-virtuoso";
import * as localeDate from "date-fns/locale";

import { useCreateEditLangAdmin } from "./hooks/use-create-edit-lang-admin";
import type { ShowCoreLanguages } from "@/graphql/hooks";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "@/components/ui/select";
import { timeZones } from "./timezones";
import { cn } from "@/functions/classnames";
import { Switch } from "@/components/ui/switch";

interface Props {
  data?: ShowCoreLanguages;
}

export const CreateEditLangAdmin = ({ data }: Props) => {
  const t = useTranslations("admin.core.langs.actions");
  const { form, onSubmit } = useCreateEditLangAdmin({ data });

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t(data ? "edit.title" : "create.title")}</DialogTitle>
        {data?.name && <DialogDescription>{data.name}</DialogDescription>}
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("create.name.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("create.name.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("create.timezone.label")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn({
                        "text-muted-foreground": !field.value
                      })}
                    >
                      {field.value}
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <Virtuoso
                      style={{ height: "200px" }}
                      data={timeZones}
                      itemContent={(index, zone) => (
                        <SelectItem value={zone}>{zone}</SelectItem>
                      )}
                    />
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="locale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("create.locale.label")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn({
                        "text-muted-foreground": !field.value
                      })}
                    >
                      {field.value}
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <Virtuoso
                      style={{ height: "200px" }}
                      data={Object.keys(localeDate)}
                      itemContent={(index, zone) => (
                        <SelectItem value={zone}>{zone}</SelectItem>
                      )}
                    />
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {!data ? (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("create.code.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("create.code.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("create.code.desc")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="default"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("edit.default.label")}
                    </FormLabel>
                    <FormDescription>{t("edit.default.desc")}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={data.default}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="time_24"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {t("create.time_24.label")}
                  </FormLabel>
                  <FormDescription>{t("create.time_24.desc")}</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              loading={form.formState.isSubmitting}
              disabled={!form.formState.isValid}
            >
              {t(data ? "edit.submit" : "create.submit")}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
