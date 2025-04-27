
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Upload, Mail } from "lucide-react";
import { toast } from "sonner";

const OrganizationSettings = () => {
  const [orgName, setOrgName] = useState("ComplexAssess Inc.");
  const [primaryColor, setPrimaryColor] = useState("#9b87f5");
  const [secondaryColor, setSecondaryColor] = useState("#7E69AB");
  
  const handleSaveGeneral = () => {
    toast.success("Organization settings saved successfully!");
  };
  
  const handleSaveEmails = () => {
    toast.success("Email templates saved successfully!");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="emails">Email Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>Manage your organization's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="org-name" className="text-right">Organization Name</Label>
                  <Input 
                    id="org-name" 
                    value={orgName} 
                    onChange={(e) => setOrgName(e.target.value)} 
                    className="col-span-3" 
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="org-domain" className="text-right">Domain</Label>
                  <Input 
                    id="org-domain" 
                    defaultValue="complex.com" 
                    className="col-span-3" 
                  />
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="org-logo" className="text-right pt-2">Logo</Label>
                  <div className="col-span-3">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-md border flex items-center justify-center bg-gray-100">
                        <Settings className="h-8 w-8 text-gray-400" />
                      </div>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended: 512x512px, PNG or SVG
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
              <CardDescription>Customize the look and feel of your assessments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="primary-color" className="text-right">Primary Color</Label>
                  <div className="col-span-3 flex gap-2">
                    <div className="flex-none w-8 h-8 border rounded-md overflow-hidden">
                      <input 
                        type="color" 
                        id="primary-color" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)} 
                        className="w-10 h-10 -m-1 p-0 border-none cursor-pointer" 
                      />
                    </div>
                    <Input 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="secondary-color" className="text-right">Secondary Color</Label>
                  <div className="col-span-3 flex gap-2">
                    <div className="flex-none w-8 h-8 border rounded-md overflow-hidden">
                      <input 
                        type="color" 
                        id="secondary-color" 
                        value={secondaryColor} 
                        onChange={(e) => setSecondaryColor(e.target.value)} 
                        className="w-10 h-10 -m-1 p-0 border-none cursor-pointer" 
                      />
                    </div>
                    <Input 
                      value={secondaryColor} 
                      onChange={(e) => setSecondaryColor(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Preview</Label>
                  <div className="col-span-3 p-4 border rounded-md">
                    <div 
                      className="w-full h-8 rounded-md mb-2" 
                      style={{ backgroundColor: primaryColor }} 
                    ></div>
                    <div 
                      className="w-full h-8 rounded-md" 
                      style={{ backgroundColor: secondaryColor }} 
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="emails">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize the emails sent by the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label>Team Invitation Email</Label>
                  </div>
                  <Input
                    defaultValue="Join our team at {orgName}! Click here: {inviteLink}"
                    className="h-20"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label>Assessment Invitation Email</Label>
                  </div>
                  <Input
                    defaultValue="You've been invited to take an assessment: {assessmentTitle}. Start here: {assessmentLink}"
                    className="h-20"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label>Results Notification Email</Label>
                  </div>
                  <Input
                    defaultValue="Your assessment results are now available. View them here: {resultsLink}"
                    className="h-20"
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Available variables: {"{orgName}"}, {"{inviteLink}"}, {"{assessmentTitle}"}, {"{assessmentLink}"}, {"{resultsLink}"}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveEmails}>Save Templates</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationSettings;
