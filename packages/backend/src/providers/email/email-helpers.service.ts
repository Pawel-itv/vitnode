import { Injectable } from "@nestjs/common";
import { convertColor, getHSLFromString } from "@vitnode/shared";
import { ConfigService } from "@nestjs/config";

import { getConfigFile } from "../config";
import { EmailHelpersServiceType } from "./email-helpers.type";
import EmailTemplate from "./template/email-template";

@Injectable()
export class EmailHelpersService {
  constructor(private readonly configService: ConfigService) {}

  getHelpersForEmail: EmailHelpersServiceType["getHelpersForEmail"] = () => {
    const config = getConfigFile();
    // TODO: Implement parseFrontendUrlFromEnv
    // const frontend_url = parseFrontendUrlFromEnv();
    const frontend_url: string = this.configService.getOrThrow("frontend_url");

    const primaryHSL = getHSLFromString(config.settings.email.color_primary);
    const primaryForegroundHSL = getHSLFromString(
      config.settings.email.color_primary_foreground,
    );

    return {
      site_name: config.settings.general.site_name,
      site_short_name: config.settings.general.site_short_name,
      frontend_url,
      color: {
        primary: {
          DEFAULT: `[${primaryHSL ? convertColor.hslToHex(primaryHSL) : "#215fdc"}]`,
          foreground: `[${
            primaryForegroundHSL
              ? convertColor.hslToHex(primaryForegroundHSL)
              : "#131415"
          }]`,
        },
        background: "[#f8f9fc]",
        foreground: "[#131415]",
        card: "[#fff]",
        border: "[#e0e4eb]",
        muted: {
          DEFAULT: "[#f1f3f9]",
          foreground: "[#676d79]",
        },
      },
    };
  };

  template: EmailHelpersServiceType["template"] = props => {
    return EmailTemplate({ ...props, helpers: this.getHelpersForEmail() });
  };
}
