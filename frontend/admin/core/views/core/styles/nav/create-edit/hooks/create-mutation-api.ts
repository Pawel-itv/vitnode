"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { fetcher } from "@/graphql/fetcher";
import {
  Admin__Core_Languages__Create,
  type Admin__Core_Languages__CreateMutation,
  type Admin__Core_Languages__CreateMutationVariables
} from "@/graphql/hooks";

export const createMutationApi = async (
  variables: Admin__Core_Languages__CreateMutationVariables
) => {
  try {
    const { data } = await fetcher<
      Admin__Core_Languages__CreateMutation,
      Admin__Core_Languages__CreateMutationVariables
    >({
      query: Admin__Core_Languages__Create,
      variables
    });

    revalidateTag("Core_Sessions__Authorization");
    revalidatePath("/admin/core/styles/nav", "page");
    revalidatePath("/", "layout");

    return { data };
  } catch (error) {
    return { error };
  }
};
