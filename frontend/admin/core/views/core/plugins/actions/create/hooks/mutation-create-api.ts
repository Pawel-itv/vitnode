"use server";

import {
  Admin__Core_Plugins__Create,
  Admin__Core_Plugins__CreateMutation,
  Admin__Core_Plugins__CreateMutationVariables
} from "@/utils/graphql/hooks";
import { cleanAdminCorePluginsCache } from "@/admin/core/api-tags";
import { fetcher } from "@/utils/graphql/fetcher";

export const mutationCreateApi = async (
  variables: Admin__Core_Plugins__CreateMutationVariables
) => {
  try {
    const { data } = await fetcher<
      Admin__Core_Plugins__CreateMutation,
      Admin__Core_Plugins__CreateMutationVariables
    >({
      query: Admin__Core_Plugins__Create,
      variables
    });

    cleanAdminCorePluginsCache();

    return { data };
  } catch (error) {
    return { error };
  }
};
