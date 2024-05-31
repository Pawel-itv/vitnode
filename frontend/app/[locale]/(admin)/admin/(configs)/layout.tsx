import * as React from "react";

import { LayoutConfigs } from "@/plugins/core/admin/configs/layout-configs";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return <LayoutConfigs>{children}</LayoutConfigs>;
}
