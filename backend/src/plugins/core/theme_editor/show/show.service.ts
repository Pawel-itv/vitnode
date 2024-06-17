import { join } from "path";
import * as fs from "fs";

import { Injectable } from "@nestjs/common";
import { NotFoundError } from "@vitnode/backend";

import {
  ColorsShowCoreThemeEditor,
  HslColor,
  ShowCoreThemeEditorObj
} from "./dto/show.obj";

import { ABSOLUTE_PATHS } from "@/config";
import { keysFromCSSThemeEditor } from "../../admin/theme_editor/edit/edit.service";

@Injectable()
export class ShowCoreThemeEditorService {
  private parseStringToHsl(string: string): HslColor {
    const values = string
      .trim()
      .replaceAll("%", "")
      .replaceAll("deg", "")
      .split(" ")
      .map(v => parseInt(v));

    return {
      h: values[0],
      s: values[1],
      l: values[2]
    };
  }

  protected getVariable({
    cssAsString,
    variable
  }: {
    cssAsString: string;
    variable: string;
  }): {
    dark: HslColor;
    light: HslColor;
  } {
    const regex = new RegExp(`:root\\s*{([^}]*)}|\\.dark\\s*{([^}]*)}`, "g");
    let match: RegExpExecArray | null;
    const values = {
      light: "",
      dark: ""
    };

    while ((match = regex.exec(cssAsString)) !== null) {
      const value = match[1] || match[2];
      const isDark = Boolean(match[2]);
      const backgroundMatch = value.match(`--${variable}:\\s*([^;]*)`);

      if (backgroundMatch) {
        if (isDark) {
          values.dark = backgroundMatch[1].trim();
        } else {
          values.light = backgroundMatch[1].trim();
        }
      }
    }

    return {
      light: this.parseStringToHsl(values.light),
      dark: this.parseStringToHsl(values.dark)
    };
  }

  show(): ShowCoreThemeEditorObj {
    const pathToCss = join(
      ABSOLUTE_PATHS.plugin({ code: "core" }).frontend.templates,
      "layout",
      "global.css"
    );

    if (!fs.existsSync(pathToCss)) {
      throw new NotFoundError("CSS file in Theme not found!");
    }

    const cssAsString = fs.readFileSync(pathToCss, "utf8");
    const colors: ColorsShowCoreThemeEditor = keysFromCSSThemeEditor.reduce(
      (acc, variable) => {
        acc[variable.replace("-", "_")] = this.getVariable({
          cssAsString,
          variable
        });

        return acc;
      },
      {} as ColorsShowCoreThemeEditor
    );

    return {
      colors
    };
  }
}
