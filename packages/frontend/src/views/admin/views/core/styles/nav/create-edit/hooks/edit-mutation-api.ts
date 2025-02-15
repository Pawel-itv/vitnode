'use server';

import { revalidatePath } from 'next/cache';

import { fetcher, FetcherErrorType } from '@/graphql/fetcher';
import {
  Admin__Core_Styles__Nav__Edit,
  Admin__Core_Styles__Nav__EditMutation,
  Admin__Core_Styles__Nav__EditMutationVariables,
} from '@/graphql/mutations/admin/styles/nav/core_styles__nav__edit.generated';

export const editMutationApi = async (
  variables: Admin__Core_Styles__Nav__EditMutationVariables,
) => {
  try {
    await fetcher<
      Admin__Core_Styles__Nav__EditMutation,
      Admin__Core_Styles__Nav__EditMutationVariables
    >({
      query: Admin__Core_Styles__Nav__Edit,
      variables,
    });
  } catch (e) {
    return { error: e as FetcherErrorType };
  }

  revalidatePath('/', 'layout');
};
