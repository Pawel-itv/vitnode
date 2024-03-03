import { lazy, type LazyExoticComponent } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getSessionData } from "@/functions/get-session-data";
import { getForumItemData } from "../layout";
import type { ErrorViewProps } from "@/themes/1/core/views/global/error/error-view";

interface Props {
  params: {
    id: string;
    locale: string;
  };
}

export async function generateMetadata({
  params: { locale }
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "forum.topics.create" });

  return {
    title: t("title"),
    robots: "noindex, nofollow"
  };
}

export default async function Page({ params: { id } }: Props) {
  const { theme_id } = await getSessionData();
  const { data } = await getForumItemData({ id });
  if (!data) throw new Error("No data");

  if (!data.forum_forums__show.edges[0].permissions.can_create) {
    const ErrorView: LazyExoticComponent<
      (props: ErrorViewProps) => JSX.Element
    > = lazy(() =>
      import(`@/themes/${theme_id}/core/views/global/error/error-view`).catch(
        () => import("@/themes/1/core/views/global/error/error-view")
      )
    );

    return <ErrorView code="403" />;
  }

  const PageFromTheme: LazyExoticComponent<() => JSX.Element> = lazy(() =>
    import(
      `@/themes/${theme_id}/forum/views/forum/forums/views/create-topic/create-topic-view`
    ).catch(
      () =>
        import(
          "@/themes/1/forum/views/forum/forums/views/create-topic/create-topic-view"
        )
    )
  );

  return <PageFromTheme />;
}
