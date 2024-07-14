import React from 'react';
import {
  AdminLayout,
  generateMetadataAdminLayout,
} from 'vitnode-frontend/views/admin/layout/admin-layout';
import { AuthAdminLayout } from 'vitnode-frontend/views/admin/layout/auth/auth-admin-layout';

export const generateMetadata = generateMetadataAdminLayout;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>
      <AuthAdminLayout>{children}</AuthAdminLayout>
    </AdminLayout>
  );
}
