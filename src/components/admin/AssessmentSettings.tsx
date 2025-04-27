import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Settings2 } from "lucide-react";
import { toast } from "sonner";

const AssessmentSettings = () => {
  const [defaultTimeLimit, setDefaultTimeLimit] = useState(45);
  
  const handleSave = () => {
    toast.success("Assessment settings saved successfully!");
  };

  const categories = [
    { id: "1", name: "Frontend Development", numQuestions: 12 },
    { id: "2", name: "Backend Development", numQuestions: 8 },
    { id: "3", name: "DevOps", numQuestions: 5 },
    { id: "4", name: "UI/UX Design", numQuestions: 7 },
  ];

  const rubricTemplates = [
    { id: "1", name: "Technical Interview", criteria: 5 },
    { id: "2", name: "Code Quality Review", criteria: 4 },
    { id: "3", name: "Design Evaluation", criteria: 6 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Default Assessment Settings</CardTitle>
          <CardDescription>Configure the default settings for new assessments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="default-time-limit" className="text-right">Default Time Limit</Label>
              <div className="col-span-3 flex items-center gap-4">
                <Slider 
                  id="default-time-limit"
                  min={5} 
                  max={180} 
                  step={5} 
                  defaultValue={[defaultTimeLimit]} 
                  onValueChange={(values) => setDefaultTimeLimit(values[0])}
                  className="flex-1 max-w-xs" 
                />
                <span className="w-12 text-center">{defaultTimeLimit} min</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="default-ai-model" className="text-right">Default AI Model</Label>
              <div className="col-span-3 max-w-xs">
                <Select defaultValue="gpt-4o">
                  <SelectTrigger id="default-ai-model">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="auto-grading" className="text-right">Enable Auto-grading</Label>
              <div className="col-span-3">
                <Switch id="auto-grading" defaultChecked />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="analytics" className="text-right">Enable AI Analytics</Label>
              <div className="col-span-3">
                <Switch id="analytics" defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave}>Save Default Settings</Button>
        </CardFooter>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Question Categories</CardTitle>
              <CardDescription>Manage question categories for organization</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead className="text-right">Questions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right">{category.numQuestions}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Rubric Templates</CardTitle>
              <CardDescription>Manage reusable rubric templates</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Template
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead className="text-right">Criteria</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rubricTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell className="text-right">{template.criteria}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentSettings;
