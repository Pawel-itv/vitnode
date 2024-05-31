import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

import { HeaderContent } from "@/components/header-content/header-content";
import { Card } from "@/components/ui/card";
import {
  Admin__Core_Files__Show,
  ShowCoreFilesSortingColumnEnum,
  Admin__Core_Files__ShowQuery,
  Admin__Core_Files__ShowQueryVariables
} from "@/utils/graphql/hooks";
import {
  usePaginationAPISsr,
  SearchParamsPagination
} from "@/plugins/core/hooks/utils/use-pagination-api-ssr";
import { fetcher } from "@/utils/graphql/fetcher";
import { FilesAdvancedCoreAdminView } from "@/plugins/core/admin/views/core/advanced/files/files-advanced-core-adminpview";

const getData = async (variables: Admin__Core_Files__ShowQueryVariables) => {
  const { data } = await fetcher<
    Admin__Core_Files__ShowQuery,
    Admin__Core_Files__ShowQueryVariables
  >({
    query: Admin__Core_Files__Show,
    variables
  });

  return data;
};

interface Props {
  searchParams: SearchParamsPagination;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("admin.core.advanced.files");

  return {
    title: t("title")
  };
}

export default async function Page({ searchParams }: Props) {
  const variables = usePaginationAPISsr({
    searchParams,
    defaultPageSize: 10,
    search: true,
    sortByEnum: ShowCoreFilesSortingColumnEnum
  });
  const [t, data] = await Promise.all([
    getTranslations("admin.core.advanced.files"),
    getData(variables)
  ]);

  return (
    <>
      <HeaderContent h1={t("title")} />

      <Card className="p-6">
        <FilesAdvancedCoreAdminView {...data} />
      </Card>
    </>
  );
}
