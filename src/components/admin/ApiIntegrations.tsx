
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { PlusCircle, Key, KeyRound, Eye, EyeOff, BarChart } from "lucide-react";
import { toast } from "sonner";

const ApiIntegrations = () => {
  const [showNewIntegrationDialog, setShowNewIntegrationDialog] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const integrations = [
    { id: "1", name: "OpenAI", provider: "openai", isActive: true, lastUsed: "2 hours ago" },
    { id: "2", name: "Custom Endpoint", provider: "custom", isActive: false, lastUsed: "5 days ago" },
  ];

  const handleSaveIntegration = () => {
    toast.success("API integration added successfully!");
    setShowNewIntegrationDialog(false);
  };
  
  const handleToggleIntegration = (id: string, active: boolean) => {
    toast.success(`Integration ${active ? 'enabled' : 'disabled'} successfully`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>API Integrations</CardTitle>
            <CardDescription>Manage API integrations for enhanced functionality</CardDescription>
          </div>
          <Dialog open={showNewIntegrationDialog} onOpenChange={setShowNewIntegrationDialog}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Integration
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Integration</DialogTitle>
                <DialogDescription>Configure a new API integration for your assessments</DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="integration-name" className="text-right">Integration Name</Label>
                  <Input id="integration-name" placeholder="e.g., OpenAI GPT-4" className="col-span-3" />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="provider" className="text-right">Provider</Label>
                  <div className="col-span-3">
                    <select 
                      id="provider" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="openai">OpenAI</option>
                      <option value="custom">Custom Endpoint</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="api-key" className="text-right">API Key</Label>
                  <div className="col-span-3 relative">
                    <Input 
                      id="api-key" 
                      type={showApiKey ? "text" : "password"} 
                      placeholder="sk-..." 
                      className="pr-10" 
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endpoint-url" className="text-right">Endpoint URL</Label>
                  <Input 
                    id="endpoint-url" 
                    placeholder="https://api.example.com/v1" 
                    className="col-span-3" 
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewIntegrationDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSaveIntegration}>Save Integration</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Integration</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {integrations.map((integration) => (
                <TableRow key={integration.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4" />
                      {integration.name}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{integration.provider}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={integration.isActive} 
                        onCheckedChange={(checked) => handleToggleIntegration(integration.id, checked)}
                      />
                      <span>{integration.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{integration.lastUsed}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <KeyRound className="mr-2 h-4 w-4" />
                        Manage Key
                      </Button>
                      <Button variant="outline" size="sm">
                        Test
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API Access Keys</CardTitle>
          <CardDescription>Generate API keys for external applications to access your assessment data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Main API Key
                  </div>
                </TableCell>
                <TableCell>2023-04-15</TableCell>
                <TableCell>3 days ago</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      Revoke
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <div className="flex justify-end">
            <Button>
              <Key className="mr-2 h-4 w-4" />
              Generate New API Key
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiIntegrations;
