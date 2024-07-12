'use server';

import { revalidatePath } from 'next/cache';

import { fetcher } from '@/graphql/fetcher';
import {
  Admin__Core_Staff_Moderators__Create,
  Admin__Core_Staff_Moderators__CreateMutation,
  Admin__Core_Staff_Moderators__CreateMutationVariables,
} from '@/graphql/graphql';

export const mutationApi = async (
  variables: Admin__Core_Staff_Moderators__CreateMutationVariables,
) => {
  await fetcher<
    Admin__Core_Staff_Moderators__CreateMutation,
    Admin__Core_Staff_Moderators__CreateMutationVariables
  >({
    query: Admin__Core_Staff_Moderators__Create,
    variables,
  });

  revalidatePath('/', 'layout');
};
