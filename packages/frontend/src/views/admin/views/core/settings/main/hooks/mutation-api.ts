'use server';

import { revalidatePath } from 'next/cache';

import { fetcher, FetcherErrorType } from '@/graphql/fetcher';
import {
  Admin__Core_Main_Settings__Edit,
  Admin__Core_Main_Settings__EditMutation,
  Admin__Core_Main_Settings__EditMutationVariables,
} from '@/graphql/mutations/admin/settings/admin__core_main_settings__edit.generated';

export const mutationApi = async (
  variables: Admin__Core_Main_Settings__EditMutationVariables,
) => {
  try {
    await fetcher<
      Admin__Core_Main_Settings__EditMutation,
      Admin__Core_Main_Settings__EditMutationVariables
    >({
      query: Admin__Core_Main_Settings__Edit,
      variables,
    });
  } catch (e) {
    return { error: e as FetcherErrorType };
  }

  revalidatePath('/', 'layout');
};
