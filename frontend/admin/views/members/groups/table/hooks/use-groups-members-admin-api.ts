import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { fetcher } from '@/graphql/fetcher';
import {
  Show_Admin_Groups,
  Show_Admin_GroupsQuery,
  Show_Admin_GroupsQueryVariables,
  ShowAdminGroupsSortingColumnEnum
} from '@/graphql/hooks';
import { APIKeys } from '@/graphql/api-keys';
import { useGetSortByParamsAPI } from '@/hooks/core/utils/use-get-sort-by-params-api';

export const useGroupMembersAdminAPI = () => {
  const searchParams = useSearchParams();
  const pagination = {
    first: searchParams.get('first') ?? 0,
    last: searchParams.get('last'),
    cursor: searchParams.get('cursor') ?? null,
    sortBy: useGetSortByParamsAPI({ constEnum: ShowAdminGroupsSortingColumnEnum })
  };

  return useQuery({
    queryKey: [APIKeys.GROUPS_MEMBERS, { ...pagination }],
    queryFn: async () => {
      const defaultFirst = !pagination.last ? 10 : null;

      return await fetcher<Show_Admin_GroupsQuery, Show_Admin_GroupsQueryVariables>({
        query: Show_Admin_Groups,
        variables: {
          first: pagination.first ? +pagination.first : defaultFirst,
          last: pagination.last ? +pagination.last : null,
          cursor: pagination.cursor,
          sortBy: pagination.sortBy
        }
      });
    },
    placeholderData: previousData => previousData
  });
};
