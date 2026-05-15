import AppLayout from '@/components/AppLayout';
import CampaignManagementClient from './components/CampaignManagementClient';

export default function CampaignManagementPage() {
  return (
    <AppLayout activeRoute="/campaign-management">
      <CampaignManagementClient />
    </AppLayout>
  );
}
