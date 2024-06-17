import { join } from "path";
import * as fs from "fs";

import { NotFoundError } from "@vitnode/backend";

import { ShowAdminManifestMetadataObj } from "./show/dto/show.obj";

import { ABSOLUTE_PATHS } from "@/config";

export const getManifest = ({
  lang_code
}: {
  lang_code: string;
}): ShowAdminManifestMetadataObj => {
  const path = join(
    ABSOLUTE_PATHS.uploads.public,
    "assets",
    lang_code,
    "manifest.webmanifest"
  );

  if (!fs.existsSync(path)) {
    throw new NotFoundError(`Manifest for language code: ${lang_code}`);
  }

  const file = fs.readFileSync(path, "utf8");
  const data: ShowAdminManifestMetadataObj = JSON.parse(file);

  return data;
};
