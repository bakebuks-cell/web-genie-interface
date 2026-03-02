import { FileText } from "lucide-react";

const Docs = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">Documentation</h1>
        <p className="text-muted-foreground">
          Comprehensive guides, API references, and tutorials are coming soon.
        </p>
      </div>
    </div>
  );
};

export default Docs;
