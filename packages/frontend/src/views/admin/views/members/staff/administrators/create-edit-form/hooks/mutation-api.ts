'use server';

import { revalidatePath } from 'next/cache';

import {
  Admin__Core_Staff_Administrators__Create,
  Admin__Core_Staff_Administrators__CreateMutation,
  Admin__Core_Staff_Administrators__CreateMutationVariables,
} from '@/graphql/graphql';
import { fetcher } from '@/graphql/fetcher';

export const mutationApi = async (
  variables: Admin__Core_Staff_Administrators__CreateMutationVariables,
) => {
  try {
    const { data } = await fetcher<
      Admin__Core_Staff_Administrators__CreateMutation,
      Admin__Core_Staff_Administrators__CreateMutationVariables
    >({
      query: Admin__Core_Staff_Administrators__Create,
      variables,
    });

    revalidatePath('/admin', 'layout');

    return { data };
  } catch (error) {
    return { error };
  }
};
