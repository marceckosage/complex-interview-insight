
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { 
  Shield, ShieldCheck, ShieldX, PlusCircle, Check, X
} from "lucide-react";
import { toast } from "sonner";

const PermissionSettings = () => {
  const [showAddRoleDialog, setShowAddRoleDialog] = useState(false);
  
  const roles = [
    { 
      id: "1", 
      name: "Admin", 
      description: "Full access to all features", 
      users: 1,
      permissions: {
        createAssessment: true,
        editAnyAssessment: true,
        deleteAnyAssessment: true,
        viewAllResults: true,
        manageTeam: true,
        manageSettings: true,
        manageApiKeys: true
      }
    },
    { 
      id: "2", 
      name: "Reviewer", 
      description: "Can view and grade submitted assessments", 
      users: 2,
      permissions: {
        createAssessment: false,
        editAnyAssessment: false,
        deleteAnyAssessment: false,
        viewAllResults: true,
        manageTeam: false,
        manageSettings: false,
        manageApiKeys: false
      }
    },
    { 
      id: "3", 
      name: "Creator", 
      description: "Can create and manage their own assessments", 
      users: 1,
      permissions: {
        createAssessment: true,
        editAnyAssessment: false,
        deleteAnyAssessment: false,
        viewAllResults: false,
        manageTeam: false,
        manageSettings: false,
        manageApiKeys: false
      }
    },
  ];

  const assessments = [
    { id: "1", title: "Frontend Developer Assessment", sharedWith: ["Admin", "Reviewer"] },
    { id: "2", title: "Backend Developer Assessment", sharedWith: ["Admin"] },
  ];

  const handleSaveRole = () => {
    toast.success("Role created successfully!");
    setShowAddRoleDialog(false);
  };

  const handleUpdatePermission = (roleId: string, permission: string, value: boolean) => {
    toast.success(`Permission updated successfully`);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
          <TabsTrigger value="assessments">Assessment Access</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Roles</CardTitle>
                <CardDescription>Manage roles and permissions for your team members</CardDescription>
              </div>
              <Dialog open={showAddRoleDialog} onOpenChange={setShowAddRoleDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Role
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Role</DialogTitle>
                    <DialogDescription>Define a new role with specific permissions</DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role-name" className="text-right">Role Name</Label>
                      <Input id="role-name" placeholder="e.g., Assessment Manager" className="col-span-3" />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role-description" className="text-right">Description</Label>
                      <Input id="role-description" placeholder="Brief description of the role" className="col-span-3" />
                    </div>
                    
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right pt-2">Permissions</Label>
                      <div className="col-span-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="create-assessment">Create assessments</Label>
                          <Switch id="create-assessment" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="edit-any-assessment">Edit any assessment</Label>
                          <Switch id="edit-any-assessment" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="delete-any-assessment">Delete any assessment</Label>
                          <Switch id="delete-any-assessment" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="view-all-results">View all results</Label>
                          <Switch id="view-all-results" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="manage-team">Manage team</Label>
                          <Switch id="manage-team" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="manage-settings">Manage settings</Label>
                          <Switch id="manage-settings" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddRoleDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" onClick={handleSaveRole}>Create Role</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {role.name === "Admin" ? (
                            <ShieldCheck className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Shield className="h-4 w-4" />
                          )}
                          {role.name}
                        </div>
                      </TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>{role.users}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          {role.name !== "Admin" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>Define what each role can do in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission</TableHead>
                    {roles.map((role) => (
                      <TableHead key={role.id}>{role.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Create assessments</TableCell>
                    {roles.map((role) => (
                      <TableCell key={`${role.id}-create`}>
                        <Switch 
                          checked={role.permissions.createAssessment} 
                          disabled={role.name === "Admin"}
                          onCheckedChange={(checked) => handleUpdatePermission(role.id, 'createAssessment', checked)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>Edit any assessment</TableCell>
                    {roles.map((role) => (
                      <TableCell key={`${role.id}-edit`}>
                        <Switch 
                          checked={role.permissions.editAnyAssessment} 
                          disabled={role.name === "Admin"}
                          onCheckedChange={(checked) => handleUpdatePermission(role.id, 'editAnyAssessment', checked)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>Delete any assessment</TableCell>
                    {roles.map((role) => (
                      <TableCell key={`${role.id}-delete`}>
                        <Switch 
                          checked={role.permissions.deleteAnyAssessment} 
                          disabled={role.name === "Admin"}
                          onCheckedChange={(checked) => handleUpdatePermission(role.id, 'deleteAnyAssessment', checked)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>View all results</TableCell>
                    {roles.map((role) => (
                      <TableCell key={`${role.id}-view`}>
                        <Switch 
                          checked={role.permissions.viewAllResults} 
                          disabled={role.name === "Admin"}
                          onCheckedChange={(checked) => handleUpdatePermission(role.id, 'viewAllResults', checked)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>Manage team</TableCell>
                    {roles.map((role) => (
                      <TableCell key={`${role.id}-team`}>
                        <Switch 
                          checked={role.permissions.manageTeam} 
                          disabled={role.name === "Admin"}
                          onCheckedChange={(checked) => handleUpdatePermission(role.id, 'manageTeam', checked)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>Manage settings</TableCell>
                    {roles.map((role) => (
                      <TableCell key={`${role.id}-settings`}>
                        <Switch 
                          checked={role.permissions.manageSettings} 
                          disabled={role.name === "Admin"}
                          onCheckedChange={(checked) => handleUpdatePermission(role.id, 'manageSettings', checked)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>Manage API keys</TableCell>
                    {roles.map((role) => (
                      <TableCell key={`${role.id}-api`}>
                        <Switch 
                          checked={role.permissions.manageApiKeys} 
                          disabled={role.name === "Admin"}
                          onCheckedChange={(checked) => handleUpdatePermission(role.id, 'manageApiKeys', checked)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Access Control</CardTitle>
              <CardDescription>Manage who can access specific assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assessment</TableHead>
                    {roles.map((role) => (
                      <TableHead key={role.id}>{role.name}</TableHead>
                    ))}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.title}</TableCell>
                      {roles.map((role) => (
                        <TableCell key={`${assessment.id}-${role.id}`}>
                          {assessment.sharedWith.includes(role.name) ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-gray-300" />
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Manage Access
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PermissionSettings;
