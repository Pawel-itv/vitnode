import {
  NavAdminView,
  generateMetadataNavAdmin,
} from 'vitnode-frontend/admin/core/styles/nav/nav-admin-view';

export const generateMetadata = generateMetadataNavAdmin;

export default function Page() {
  return <NavAdminView />;
}
