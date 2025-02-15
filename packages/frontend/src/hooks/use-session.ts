import React from 'react';

import { Core_Sessions__AuthorizationQuery } from '@/graphql/queries/core_sessions__authorization.generated';
import { AuthorizationCurrentUserObj, ShowCoreNav } from '@/graphql/types';

interface Args {
  files: Core_Sessions__AuthorizationQuery['core_sessions__authorization']['files'];
  nav: ShowCoreNav[];
  session: Omit<AuthorizationCurrentUserObj, 'posts'> | null | undefined;
}

export const SessionContext = React.createContext<Args>({
  session: null,
  nav: [],
  files: {
    allow_upload: true,
    max_storage_for_submit: 10000,
    total_max_storage: 500000,
    space_used: 0,
  },
});

export const useSession = () => React.useContext(SessionContext);
