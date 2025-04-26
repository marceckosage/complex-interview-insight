
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { Settings } from "lucide-react";

interface AISettingsProps {
  apiKey?: string;
  onSaveSettings: (settings: { apiKey: string; model: string; temperature: number }) => void;
  defaultModel?: string;
  defaultTemperature?: number;
}

const AISettings = ({ 
  apiKey: initialApiKey = "", 
  defaultModel = "gpt-4o", 
  defaultTemperature = 0.7,
  onSaveSettings 
}: AISettingsProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [model, setModel] = useState(defaultModel);
  const [temperature, setTemperature] = useState(defaultTemperature);

  const models = [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo" }
  ];

  const handleSave = () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key.",
        variant: "destructive"
      });
      return;
    }

    onSaveSettings({
      apiKey,
      model,
      temperature
    });

    toast({
      title: "AI Settings Saved",
      description: "Your OpenAI API settings have been saved securely."
    });

    setIsOpen(false);
  };

  // Mask API key for display
  const maskedApiKey = apiKey 
    ? `${apiKey.substring(0, 3)}${"*".repeat(apiKey.length - 6)}${apiKey.substring(apiKey.length - 3)}`
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" /> AI Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>OpenAI Integration Settings</DialogTitle>
          <DialogDescription>
            Configure your OpenAI API settings for AI-powered assessment features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
            />
            <p className="text-xs text-gray-500">
              Your API key is stored securely and never shared.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="temperature">Temperature: {temperature}</Label>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[temperature]}
              onValueChange={(values) => setTemperature(values[0])}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Precise</span>
              <span>Balanced</span>
              <span>Creative</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AISettings;

export const AISettingsCard = ({ 
  apiKey, 
  onSaveSettings, 
  defaultModel, 
  defaultTemperature 
}: AISettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" /> AI Integration
        </CardTitle>
        <CardDescription>
          Configure OpenAI API settings for AI-powered features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">API Key Status:</span>
            <span className={`text-sm ${apiKey ? "text-green-600" : "text-amber-600"}`}>
              {apiKey ? "Configured" : "Not Configured"}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Selected Model:</span>
            <span className="text-sm">{defaultModel || "Default"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <AISettings 
          apiKey={apiKey}
          defaultModel={defaultModel}
          defaultTemperature={defaultTemperature}
          onSaveSettings={onSaveSettings}
        />
      </CardFooter>
    </Card>
  );
};
