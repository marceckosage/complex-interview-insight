
import { Assessment } from "@/types/assessment";
import { toast } from "@/components/ui/use-toast";

/**
 * Exports an assessment to CSV format and triggers a download
 * @param assessment The assessment to export
 */
export const exportAssessmentToCSV = async (assessment: Assessment): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Show loading toast on mobile
      const loadingToast = toast({
        title: "Preparing export",
        description: "Getting your assessment data ready for download...",
      });
      
      // Simulate a delay for an API call
      setTimeout(() => {
        // Start with the headers
        const headers = [
          "ID",
          "Title",
          "Description",
          "Time Limit",
          "Created At",
          "Created By",
          "Question ID",
          "Question Type",
          "Question Text",
          "Options",
          "Correct Answer",
          "Max Score"
        ];
        
        const rows: string[][] = [];
        
        // Add the assessment data
        assessment.questions.forEach(question => {
          const row = [
            assessment.id,
            assessment.title,
            assessment.description,
            assessment.timeLimit?.toString() || "",
            new Date(assessment.createdAt).toISOString(),
            assessment.createdBy,
            question.id,
            question.type,
            question.text,
            question.options ? JSON.stringify(question.options.map(o => o.text)) : "",
            question.options ? 
              JSON.stringify(question.options.filter(o => o.isCorrect).map(o => o.text)) : "",
            question.maxScore?.toString() || ""
          ];
          
          rows.push(row);
        });
        
        // Convert to CSV content
        const csvContent = [
          headers.join(','),
          ...rows.map(row => 
            row.map(cell => 
              // Escape commas and quotes
              typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
            ).join(',')
          )
        ].join('\n');
        
        // Create and download the CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${assessment.title.replace(/\s+/g, '_')}_assessment.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Close loading toast and show success toast
        toast({
          title: "Export complete",
          description: "Your assessment has been exported successfully.",
        });
        
        resolve();
      }, 1000); // Simulate API delay
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "There was a problem exporting your assessment data."
      });
      reject(error);
    }
  });
};
