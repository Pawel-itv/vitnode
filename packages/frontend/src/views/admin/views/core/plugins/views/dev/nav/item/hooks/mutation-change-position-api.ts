'use server';

import { revalidatePath } from 'next/cache';

import { fetcher, FetcherErrorType } from '@/graphql/fetcher';
import {
  Admin__Core_Plugins__Nav__Change_Position,
  Admin__Core_Plugins__Nav__Change_PositionMutation,
  Admin__Core_Plugins__Nav__Change_PositionMutationVariables,
} from '@/graphql/mutations/admin/plugins/dev/nav/admin__core_plugins__nav__change_position.generated';

export const mutationChangePositionApi = async (
  variables: Admin__Core_Plugins__Nav__Change_PositionMutationVariables,
) => {
  try {
    const data = await fetcher<
      Admin__Core_Plugins__Nav__Change_PositionMutation,
      Admin__Core_Plugins__Nav__Change_PositionMutationVariables
    >({
      query: Admin__Core_Plugins__Nav__Change_Position,
      variables,
    });

    revalidatePath('/[locale]/admin/(auth)/(vitnode)', 'layout');

    return { data };
  } catch (e) {
    return { error: e as FetcherErrorType };
  }
};
