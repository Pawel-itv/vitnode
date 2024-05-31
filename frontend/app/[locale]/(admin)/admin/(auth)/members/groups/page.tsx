import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { GroupsMembersAdminView } from "@/admin/core/views/members/groups/groups-members-admin-view";
import {
  Admin__Core_Groups__Show,
  ShowAdminGroupsSortingColumnEnum,
  Admin__Core_Groups__ShowQuery,
  Admin__Core_Groups__ShowQueryVariables
} from "@/utils/graphql/hooks";
import {
  usePaginationAPISsr,
  SearchParamsPagination
} from "@/plugins/core/hooks/utils/use-pagination-api-ssr";
import { fetcher } from "@/utils/graphql/fetcher";

interface Props {
  searchParams: SearchParamsPagination;
}

const getData = async (variables: Admin__Core_Groups__ShowQueryVariables) => {
  const { data } = await fetcher<
    Admin__Core_Groups__ShowQuery,
    Admin__Core_Groups__ShowQueryVariables
  >({
    query: Admin__Core_Groups__Show,
    variables
  });

  return data;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("admin.members.groups");

  return {
    title: t("title")
  };
}

export default async function Page({ searchParams }: Props) {
  const variables = usePaginationAPISsr({
    searchParams,
    search: true,
    sortByEnum: ShowAdminGroupsSortingColumnEnum,
    defaultPageSize: 10
  });
  const data = await getData(variables);

  return <GroupsMembersAdminView data={data} />;
}
