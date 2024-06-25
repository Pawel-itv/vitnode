import { cn, CONFIG } from "vitnode-frontend/helpers";
import { Img } from "vitnode-frontend/components";

import { Maybe, AvatarUser as AvatarUserType } from "@/graphql/hooks";

const generateLetterPhoto = (letter: string, color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" style="background:#${color}"><g><text text-anchor="middle" dy=".35em" x="512" y="512" fill="#ffffff" font-size="700" font-family="-apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif">${letter.toLocaleUpperCase()}</text></g></svg>`,
  )}`;

interface Props {
  sizeInRem: number;
  user: {
    avatar_color: string;
    name: string;
    name_seo: string;
    avatar?: Maybe<Pick<AvatarUserType, "dir_folder" | "file_name">>;
  };
  className?: string;
}

export const AvatarUser = ({
  className,
  sizeInRem,
  user: { avatar, avatar_color, name },
}: Props) => {
  return (
    <Img
      className={cn("flex-shrink-0 rounded-full", className)}
      imageClassName="object-cover"
      src={
        avatar
          ? `${CONFIG.graphql_public_url}/${avatar.dir_folder}/${avatar.file_name}`
          : generateLetterPhoto(name.slice(0, 1), avatar_color)
      }
      alt={name}
      width={sizeInRem * 16}
      height={sizeInRem * 16}
      priority={!avatar}
    />
  );
};
