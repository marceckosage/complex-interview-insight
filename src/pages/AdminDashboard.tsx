
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-6 w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          
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
