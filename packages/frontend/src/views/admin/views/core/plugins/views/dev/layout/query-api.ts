import {
  Admin__Core_Plugins__Show__Item,
  Admin__Core_Plugins__Show__ItemQuery,
  Admin__Core_Plugins__Show__ItemQueryVariables,
} from '@/graphql/graphql';
import { ErrorType, fetcher } from '@/graphql/fetcher';

export const getPluginDataAdmin = async (
  variables: Admin__Core_Plugins__Show__ItemQueryVariables,
) => {
  try {
    const { data } = await fetcher<
      Admin__Core_Plugins__Show__ItemQuery,
      Admin__Core_Plugins__Show__ItemQueryVariables
    >({
      query: Admin__Core_Plugins__Show__Item,
      variables,
    });

    return { data };
  } catch (e) {
    const error = e as ErrorType;

    return { error };
  }
};
