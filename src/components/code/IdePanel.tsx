import { useState } from "react";
import { File, Folder, Search, ChevronDown, ChevronRight, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

const sampleTree: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "pages",
        type: "folder",
        children: [
          { name: "Home.tsx", type: "file" },
          { name: "About.tsx", type: "file" },
          { name: "Pricing.tsx", type: "file" },
        ],
      },
      {
        name: "components",
        type: "folder",
        children: [
          { name: "Header.tsx", type: "file" },
          { name: "Hero.tsx", type: "file" },
        ],
      },
    ],
  },
  {
    name: "styles",
    type: "folder",
    children: [{ name: "index.css", type: "file" }],
  },
  { name: "package.json", type: "file" },
];

const sampleCode: Record<string, string> = {
  "Home.tsx": `import React from 'react';
import { Hero } from '../components/Hero';
import { Header } from '../components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">
          Welcome to Your App
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          This is the main landing page of your
          generated application.
        </p>
      </main>
    </div>
  );
}`,
  "About.tsx": `import React from 'react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-muted-foreground">
        Learn more about our mission and team.
      </p>
    </div>
  );
}`,
  "Pricing.tsx": `import React from 'react';

export default function Pricing() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Pricing</h1>
      <div className="grid grid-cols-3 gap-6">
        <PriceCard title="Free" price="$0" />
        <PriceCard title="Pro" price="$19" />
        <PriceCard title="Enterprise" price="$99" />
      </div>
    </div>
  );
}`,
  "Header.tsx": `import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="border-b border-border">
      <nav className="container mx-auto px-4 h-16
        flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          MyApp
        </Link>
        <div className="flex gap-6">
          <Link to="/about">About</Link>
          <Link to="/pricing">Pricing</Link>
        </div>
      </nav>
    </header>
  );
}`,
  "Hero.tsx": `import React from 'react';

export function Hero() {
  return (
    <section className="py-24 text-center">
      <h1 className="text-5xl font-bold mb-4">
        Build Something Amazing
      </h1>
      <p className="text-xl text-muted-foreground">
        Get started with your next project today.
      </p>
    </section>
  );
}`,
  "index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 174 100% 45%;
}`,
  "package.json": `{
  "name": "my-generated-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.1"
  }
}`,
};

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  activeFile: string;
  onSelect: (name: string) => void;
}

const TreeNode = ({ node, depth, activeFile, onSelect }: TreeNodeProps) => {
  const [open, setOpen] = useState(true);
  const isFolder = node.type === "folder";
  const isActive = !isFolder && node.name === activeFile;

  return (
    <div>
      <button
        onClick={() => (isFolder ? setOpen(!open) : onSelect(node.name))}
        className={cn(
          "w-full flex items-center gap-1.5 px-2 py-1 text-xs hover:bg-primary/10 transition-colors rounded-sm",
          isActive && "bg-primary/15 text-primary"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {isFolder ? (
          open ? <ChevronDown className="w-3 h-3 flex-shrink-0 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
        ) : (
          <span className="w-3" />
        )}
        {isFolder ? (
          <Folder className="w-3.5 h-3.5 flex-shrink-0 text-primary/70" />
        ) : (
          <File className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
        )}
        <span className={cn("truncate", isActive ? "text-primary font-medium" : "text-foreground/80")}>
          {node.name}
        </span>
      </button>
      {isFolder && open && node.children?.map((child) => (
        <TreeNode key={child.name} node={child} depth={depth + 1} activeFile={activeFile} onSelect={onSelect} />
      ))}
    </div>
  );
};

const IdePanel = () => {
  const [activeFile, setActiveFile] = useState("Home.tsx");
  const [openTabs, setOpenTabs] = useState(["Home.tsx", "Header.tsx"]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectFile = (name: string) => {
    setActiveFile(name);
    if (!openTabs.includes(name)) {
      setOpenTabs([...openTabs, name]);
    }
  };

  const handleCloseTab = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = openTabs.filter((t) => t !== name);
    setOpenTabs(next);
    if (activeFile === name) {
      setActiveFile(next[next.length - 1] || "Home.tsx");
    }
  };

  const code = sampleCode[activeFile] || `// ${activeFile}`;
  const lines = code.split("\n");

  return (
    <div className="h-full flex bg-background rounded-2xl border border-border overflow-hidden">
      {/* File Explorer Sidebar */}
      <div className="w-[240px] flex-shrink-0 border-r border-border flex flex-col bg-card/60">
        <div className="px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
          Explorer
        </div>
        <div className="px-2 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 pl-7 text-xs bg-secondary/40 border-border/50"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="py-1">
            {sampleTree.map((node) => (
              <TreeNode key={node.name} node={node} depth={0} activeFile={activeFile} onSelect={handleSelectFile} />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tabs */}
        <div className="h-9 flex items-center bg-card/40 border-b border-border overflow-x-auto">
          {openTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFile(tab)}
              className={cn(
                "h-full px-3 flex items-center gap-2 text-xs border-r border-border whitespace-nowrap transition-colors",
                tab === activeFile
                  ? "bg-background text-foreground border-b-2 border-b-primary"
                  : "text-muted-foreground hover:bg-secondary/30"
              )}
            >
              <File className="w-3 h-3" />
              {tab}
              <span
                onClick={(e) => handleCloseTab(tab, e)}
                className="ml-1 hover:bg-secondary rounded p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>

        {/* Code */}
        <ScrollArea className="flex-1">
          <div className="p-4 font-mono text-[13px] leading-6">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="w-10 text-right pr-4 text-muted-foreground/40 select-none flex-shrink-0">
                  {i + 1}
                </span>
                <pre className="text-foreground/85 whitespace-pre">{line || " "}</pre>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Status Bar */}
        <div className="h-6 flex items-center justify-between px-3 bg-primary/10 border-t border-border text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>TypeScript</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Ln 12, Col 5</span>
            <span>Spaces: 2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdePanel;
