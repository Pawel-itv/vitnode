"use client";

import * as React from "react";

import { Admin__Sessions__AuthorizationQuery } from "@/utils/graphql/hooks";
import { SessionAdminContext } from "@/admin/core/hooks/use-session-admin";

interface Props {
  children: React.ReactNode;
  data: Admin__Sessions__AuthorizationQuery;
}

export const Providers = ({
  children,
  data: {
    admin__sessions__authorization: { nav, user: session, version }
  }
}: Props) => {
  return (
    <SessionAdminContext.Provider
      value={{
        session,
        version,
        nav
      }}
    >
      {children}
    </SessionAdminContext.Provider>
  );
};
