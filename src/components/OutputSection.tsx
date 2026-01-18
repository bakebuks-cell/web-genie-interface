import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check, FileCode, FolderTree, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OutputSectionProps {
  isVisible: boolean;
  generatedCode: string;
  projectStructure: string;
  instructions: string;
}

export const OutputSection = ({
  isVisible,
  generatedCode,
  projectStructure,
  instructions,
}: OutputSectionProps) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const { toast } = useToast();

  if (!isVisible) return null;

  const handleCopy = async (content: string, tabName: string) => {
    // API will be connected here later
    try {
      await navigator.clipboard.writeText(content);
      setCopiedTab(tabName);
      toast({
        title: "Copied!",
        description: `${tabName} copied to clipboard.`,
      });
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (content: string, filename: string) => {
    // API will be connected here later
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `${filename} has been downloaded.`,
    });
  };

  const CodeBlock = ({ content, tabName, filename }: { content: string; tabName: string; filename: string }) => (
    <div className="relative">
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleCopy(content, tabName)}
          className="h-8 px-3 bg-secondary/80 backdrop-blur-sm hover:bg-secondary"
        >
          {copiedTab === tabName ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span className="ml-2 text-xs">{copiedTab === tabName ? "Copied" : "Copy"}</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleDownload(content, filename)}
          className="h-8 px-3 bg-secondary/80 backdrop-blur-sm hover:bg-secondary"
        >
          <Download className="w-4 h-4" />
          <span className="ml-2 text-xs">Download</span>
        </Button>
      </div>
      <pre className="bg-foreground/5 rounded-xl p-4 pt-14 overflow-x-auto">
        <code className="text-sm font-mono text-foreground/90 whitespace-pre-wrap break-words">
          {content}
        </code>
      </pre>
    </div>
  );

  return (
    <div className="w-full animate-fade-in-up">
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl mb-4">
          <TabsTrigger
            value="code"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-soft rounded-lg px-4"
          >
            <FileCode className="w-4 h-4" />
            Generated Code
          </TabsTrigger>
          <TabsTrigger
            value="structure"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-soft rounded-lg px-4"
          >
            <FolderTree className="w-4 h-4" />
            Project Structure
          </TabsTrigger>
          <TabsTrigger
            value="instructions"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-soft rounded-lg px-4"
          >
            <BookOpen className="w-4 h-4" />
            Instructions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="mt-0">
          <CodeBlock
            content={generatedCode}
            tabName="Generated Code"
            filename="generated-code.txt"
          />
        </TabsContent>

        <TabsContent value="structure" className="mt-0">
          <CodeBlock
            content={projectStructure}
            tabName="Project Structure"
            filename="project-structure.txt"
          />
        </TabsContent>

        <TabsContent value="instructions" className="mt-0">
          <CodeBlock
            content={instructions}
            tabName="Instructions"
            filename="instructions.md"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
