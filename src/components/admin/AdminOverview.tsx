
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { mockAssessments, mockResults } from "@/services/mockData";
import { Chart } from "lucide-react";

const AdminOverview = () => {
  // Calculate statistics
  const totalAssessments = mockAssessments.length;
  const activeAssessments = mockAssessments.filter(a => !a.isArchived).length;
  const archivedAssessments = totalAssessments - activeAssessments;
  const totalResults = mockResults.length;
  const gradedResults = mockResults.filter(r => r.gradedAt).length;
  const pendingResults = totalResults - gradedResults;
  
  // Prepare chart data
  const assessmentData = [
    { name: "Active", value: activeAssessments },
    { name: "Archived", value: archivedAssessments }
  ];
  
  const resultsData = [
    { name: "Graded", value: gradedResults },
    { name: "Pending", value: pendingResults }
  ];
  
  const recentActivity = [
    { action: "Assessment Created", name: "Frontend Developer Assessment", timestamp: "2 hours ago" },
    { action: "Assessment Submitted", name: "Backend Developer Assessment", timestamp: "5 hours ago" },
    { action: "Assessment Graded", name: "DevOps Assessment", timestamp: "1 day ago" },
    { action: "Team Member Invited", name: "jane@example.com", timestamp: "2 days ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAssessments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeAssessments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalResults}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingResults}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Assessment Status</CardTitle>
            <CardDescription>Active vs. Archived Assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assessmentData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Results Status</CardTitle>
            <CardDescription>Graded vs. Pending Submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resultsData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {recentActivity.map((activity, index) => (
              <li key={index} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Chart className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
