"use server";

import { fetcher } from "@/graphql/fetcher";
import {
  Core_Files__Upload,
  type Core_Files__UploadMutation,
  type Core_Files__UploadMutationVariables
} from "@/graphql/hooks";

export const mutationApi = async (formData: FormData) => {
  const file = formData.get("file") as File;
  const plugin = formData.get("plugin") as string;
  const folder = formData.get("folder") as string;

  try {
    const { data } = await fetcher<
      Core_Files__UploadMutation,
      Omit<Core_Files__UploadMutationVariables, "file">
    >({
      query: Core_Files__Upload,
      variables: {
        plugin,
        folder
      },
      uploads: [
        {
          files: file,
          variable: "file"
        }
      ]
    });

    // Sleep for 10 seconds
    await new Promise(resolve => setTimeout(resolve, 10000));

    return { data };
  } catch (error) {
    return { error };
  }
};
