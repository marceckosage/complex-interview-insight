
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Link, Mail, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { ShareLink } from "@/types/assessment";

interface ShareAssessmentModalProps {
  assessmentId: string;
  assessmentTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const ShareAssessmentModal = ({
  assessmentId,
  assessmentTitle,
  isOpen,
  onClose,
}: ShareAssessmentModalProps) => {
  const [shareLink, setShareLink] = useState<string>("");
  const [expirationDays, setExpirationDays] = useState<number>(7);
  const [restrictDomain, setRestrictDomain] = useState<boolean>(false);
  const [allowedDomain, setAllowedDomain] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedLink, setGeneratedLink] = useState<ShareLink | null>(null);
  const [emailTo, setEmailTo] = useState<string>("");

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    
    try {
      // Mock API call to generate a secure link
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expirationDays);
      
      // Create a new share link
      const newLink: ShareLink = {
        id: `share-${Date.now()}`,
        assessmentId,
        token: Math.random().toString(36).substring(2, 15),
        expiresAt: expirationDays > 0 ? expiresAt : undefined,
        allowedDomains: restrictDomain && allowedDomain ? [allowedDomain] : undefined,
        createdBy: "admin@complex.com",
        createdAt: new Date(),
        isActive: true
      };
      
      // Create the full URL
      const baseUrl = window.location.origin;
      const fullShareLink = `${baseUrl}/take-assessment/${assessmentId}?token=${newLink.token}`;
      
      setShareLink(fullShareLink);
      setGeneratedLink(newLink);
      toast.success("Secure link generated successfully!");
    } catch (error) {
      console.error("Error generating link:", error);
      toast.error("Failed to generate secure link. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied to clipboard!");
  };

  const handleSendEmail = async () => {
    if (!emailTo) {
      toast.error("Please enter an email address");
      return;
    }
    
    if (!shareLink) {
      toast.error("Please generate a link first");
      return;
    }
    
    try {
      // Mock API call to send email
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Invitation sent to ${emailTo}`);
      setEmailTo("");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send invitation email");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Assessment</DialogTitle>
          <DialogDescription>
            Create a secure link to share "{assessmentTitle}" with test takers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {!generatedLink ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="expiration" className="text-right">
                  Link expires after (days)
                </Label>
                <Input
                  id="expiration"
                  type="number"
                  min="0"
                  className="w-20"
                  value={expirationDays}
                  onChange={(e) => setExpirationDays(parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="restrict-domain">Restrict to domain</Label>
                  <p className="text-sm text-muted-foreground">
                    Only allow specific email domains
                  </p>
                </div>
                <Switch
                  id="restrict-domain"
                  checked={restrictDomain}
                  onCheckedChange={setRestrictDomain}
                />
              </div>
              
              {restrictDomain && (
                <div className="space-y-2">
                  <Label htmlFor="allowed-domain">Allowed Email Domain</Label>
                  <Input
                    id="allowed-domain"
                    placeholder="e.g., company.com"
                    value={allowedDomain}
                    onChange={(e) => setAllowedDomain(e.target.value)}
                  />
                </div>
              )}
              
              <Button 
                onClick={handleGenerateLink} 
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Secure Link"}
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Secure Link</Label>
                <div className="flex items-center">
                  <Input
                    value={shareLink}
                    readOnly
                    className="flex-1 pr-12"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-12"
                    onClick={handleCopyLink}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 mr-2"
                    onClick={() => setGeneratedLink(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {generatedLink.expiresAt
                    ? `Link expires on ${generatedLink.expiresAt.toLocaleDateString()}`
                    : "Link does not expire"}
                  {generatedLink.allowedDomains && generatedLink.allowedDomains.length > 0 && 
                    ` • Only valid for ${generatedLink.allowedDomains.join(", ")} email domains`}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Send Via Email</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="recipient@example.com"
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                  />
                  <Button type="button" onClick={handleSendEmail}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Close
          </Button>
          
          {generatedLink && (
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyLink}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button
                type="button"
                onClick={() => window.open(shareLink, '_blank')}
              >
                <Link className="mr-2 h-4 w-4" />
                Open
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareAssessmentModal;
