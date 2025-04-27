
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOverview from "@/components/admin/AdminOverview";
import TeamManagement from "@/components/admin/TeamManagement";
import OrganizationSettings from "@/components/admin/OrganizationSettings";
import AssessmentSettings from "@/components/admin/AssessmentSettings";
import ApiIntegrations from "@/components/admin/ApiIntegrations";
import PermissionSettings from "@/components/admin/PermissionSettings";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-gray-900">Admin Dashboard</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="overflow-x-auto pb-2">
            <TabsList className={`${isMobile ? 'grid grid-cols-3' : 'flex flex-wrap'} w-full`}>
              <TabsTrigger value="overview" className="text-sm md:text-base">Overview</TabsTrigger>
              <TabsTrigger value="team" className="text-sm md:text-base">Team</TabsTrigger>
              <TabsTrigger value="permissions" className="text-sm md:text-base">Permissions</TabsTrigger>
              <TabsTrigger value="organization" className="text-sm md:text-base">Organization</TabsTrigger>
              <TabsTrigger value="assessment" className="text-sm md:text-base">Assessment</TabsTrigger>
              <TabsTrigger value="integrations" className="text-sm md:text-base">Integrations</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="space-y-4">
            <AdminOverview />
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <TeamManagement />
          </TabsContent>
          
          <TabsContent value="permissions" className="space-y-4">
            <PermissionSettings />
          </TabsContent>
          
          <TabsContent value="organization" className="space-y-4">
            <OrganizationSettings />
          </TabsContent>
          
          <TabsContent value="assessment" className="space-y-4">
            <AssessmentSettings />
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-4">
            <ApiIntegrations />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
