import { useState } from "react";
import { PromptInput } from "./PromptInput";
import { TechStackSelector } from "./TechStackSelector";
import { GenerateButton } from "./GenerateButton";
import { OutputSection } from "./OutputSection";
import { useToast } from "@/hooks/use-toast";

// Dummy generated content for UI demonstration
const dummyGeneratedCode = `// Generated Application Code
// Framework: Node.js + React

// server/index.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/tasks', (req, res) => {
  res.json({ tasks: [] });
});

app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;
  // Database logic will be implemented here
  res.json({ success: true, task: { title, description } });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});

// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTasks(data.tasks);
  };

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <TaskForm onTaskAdded={fetchTasks} />
      <TaskList tasks={tasks} />
    </div>
  );
}

export default App;`;

const dummyProjectStructure = `📁 my-web-app/
├── 📁 server/
│   ├── 📄 index.js
│   ├── 📄 package.json
│   ├── 📁 routes/
│   │   ├── 📄 tasks.js
│   │   └── 📄 users.js
│   ├── 📁 models/
│   │   ├── 📄 Task.js
│   │   └── 📄 User.js
│   └── 📁 middleware/
│       └── 📄 auth.js
├── 📁 client/
│   ├── 📄 package.json
│   ├── 📁 public/
│   │   └── 📄 index.html
│   └── 📁 src/
│       ├── 📄 App.jsx
│       ├── 📄 index.js
│       ├── 📁 components/
│       │   ├── 📄 TaskList.jsx
│       │   ├── 📄 TaskForm.jsx
│       │   └── 📄 TaskItem.jsx
│       ├── 📁 hooks/
│       │   └── 📄 useTasks.js
│       └── 📁 styles/
│           └── 📄 App.css
├── 📄 README.md
├── 📄 .gitignore
└── 📄 docker-compose.yml`;

const dummyInstructions = `# Getting Started

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- MongoDB (optional, for database)

## Installation

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd my-web-app
\`\`\`

### 2. Install server dependencies
\`\`\`bash
cd server
npm install
\`\`\`

### 3. Install client dependencies
\`\`\`bash
cd ../client
npm install
\`\`\`

### 4. Configure environment variables
Create a \`.env\` file in the server directory:
\`\`\`
PORT=3001
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=your-secret-key
\`\`\`

### 5. Start the development servers

**Server:**
\`\`\`bash
cd server
npm run dev
\`\`\`

**Client:**
\`\`\`bash
cd client
npm start
\`\`\`

## Deployment
- Use Docker Compose for containerized deployment
- Configure your production environment variables
- Set up a reverse proxy (nginx) for production

## Support
For issues and feature requests, please open a GitHub issue.`;

export const GeneratorSection = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedStack, setSelectedStack] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const { toast } = useToast();

  const handleStackSelect = (stackId: string) => {
    setSelectedStack(stackId);
    toast({
      title: "Technology Selected",
      description: `You've selected ${stackId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())} as your tech stack.`,
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please describe the application you want to build.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedStack) {
      toast({
        title: "Technology Required",
        description: "Please select a technology stack.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Generation Started",
      description: "AI is generating your web application...",
    });

    setIsLoading(true);
    setShowOutput(false);

    // Simulate API call - API will be connected here later
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsLoading(false);
    setShowOutput(true);

    toast({
      title: "Generation Complete!",
      description: "Your web application code is ready.",
    });
  };

  const isGenerateDisabled = !prompt.trim() || !selectedStack;

  return (
    <section id="generator" className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <PromptInput value={prompt} onChange={setPrompt} />
          
          <TechStackSelector
            selectedStack={selectedStack}
            onSelect={handleStackSelect}
          />

          <GenerateButton
            isLoading={isLoading}
            isDisabled={isGenerateDisabled}
            onClick={handleGenerate}
          />

          <OutputSection
            isVisible={showOutput}
            generatedCode={dummyGeneratedCode}
            projectStructure={dummyProjectStructure}
            instructions={dummyInstructions}
          />
        </div>
      </div>
    </section>
  );
};
