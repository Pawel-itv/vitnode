'use server';

import { revalidatePath } from 'next/cache';

import { fetcher, FetcherErrorType } from '@/graphql/fetcher';
import {
  Admin__Core_Staff_Moderators__Create,
  Admin__Core_Staff_Moderators__CreateMutation,
  Admin__Core_Staff_Moderators__CreateMutationVariables,
} from '@/graphql/mutations/admin/members/staff/moderators/admin__core_staff_moderators__create.generated';

export const mutationApi = async (
  variables: Admin__Core_Staff_Moderators__CreateMutationVariables,
) => {
  try {
    await fetcher<
      Admin__Core_Staff_Moderators__CreateMutation,
      Admin__Core_Staff_Moderators__CreateMutationVariables
    >({
      query: Admin__Core_Staff_Moderators__Create,
      variables,
    });
  } catch (e) {
    return { error: e as FetcherErrorType };
  }

  revalidatePath('/', 'layout');
};
