import {
  LangsCoreAdminView,
  LangsCoreAdminViewProps,
  generateMetadataLangsCoreAdmin,
} from 'vitnode-frontend/admin/core/langs/langs-core-admin-view';

export const generateMetadata = generateMetadataLangsCoreAdmin;

export default function Page(props: LangsCoreAdminViewProps) {
  return <LangsCoreAdminView {...props} />;
}
