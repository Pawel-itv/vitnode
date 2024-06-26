import { useTranslations } from "next-intl";
import * as React from "react";
import { Form, FormField } from "vitnode-frontend/components/ui/form";
import { Button } from "vitnode-frontend/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "vitnode-frontend/components/ui/dialog";
import { FilesInput } from "vitnode-frontend/components/ui/files-input";
import { Label } from "vitnode-frontend/components/ui/label";
import { Loader } from "vitnode-frontend/components/ui/loader";
import {
  RadioGroup,
  RadioGroupItem,
} from "vitnode-frontend/components/ui/radio-group";
import { useSession } from "vitnode-frontend/hooks/use-session";

import { useModalChangeAvatar } from "@/plugins/core/hooks/settings/avatar/use-modal-change-avatar";

const CropperModalChangeAvatar = React.lazy(async () =>
  import("./cropper/cropper-modal-change-avatar").then(module => ({
    default: module.CropperModalChangeAvatar,
  })),
);

export const ModalChangeAvatar = () => {
  const t = useTranslations("core");
  const { session } = useSession();
  const { form, onSubmit } = useModalChangeAvatar();
  if (!session) return null;
  const { avatar } = session;

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("settings.change_avatar.title")}</DialogTitle>
        <DialogDescription>
          {t("settings.change_avatar.desc")}
        </DialogDescription>
      </DialogHeader>

      {form.watch("type") === "upload" && form.watch("file").length > 0 ? (
        <React.Suspense fallback={<Loader />}>
          <CropperModalChangeAvatar file={form.watch("file")[0]} />
        </React.Suspense>
      ) : (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {avatar && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="upload" id="r1" />
                        <Label htmlFor="r1">
                          {t("settings.change_avatar.options.upload.title")}
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delete" id="r2" />
                        <Label htmlFor="r2">
                          {t("settings.change_avatar.options.delete.title")}
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              )}

              {form.watch("type") === "upload" && (
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FilesInput
                      id="picture"
                      {...field}
                      acceptExtensions={["png", "jpg", "jpeg"]}
                      maxFileSizeInMb={3}
                    />
                  )}
                />
              )}
            </form>

            <DialogFooter>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={
                  form.watch("type") === "upload" &&
                  form.watch("file").length === 0
                }
              >
                {t("settings.change_avatar.submit")}
              </Button>
            </DialogFooter>
          </Form>
        </>
      )}
    </>
  );
};
