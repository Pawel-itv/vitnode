"use server";

import { revalidatePath } from "next/cache";
import { fetcher } from "vitnode-frontend/graphql/fetcher";

import {
  Admin__Core_Languages__Edit,
  Admin__Core_Languages__EditMutation,
  Admin__Core_Languages__EditMutationVariables,
} from "@/graphql/hooks";

export const editMutationApi = async (
  variables: Admin__Core_Languages__EditMutationVariables,
) => {
  try {
    const { data } = await fetcher<
      Admin__Core_Languages__EditMutation,
      Admin__Core_Languages__EditMutationVariables
    >({
      query: Admin__Core_Languages__Edit,
      variables,
    });

    revalidatePath("/", "layout");

    return { data };
  } catch (error) {
    return { error };
  }
};
