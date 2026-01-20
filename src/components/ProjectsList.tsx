import { motion } from 'framer-motion';
import { Folder, Clock, ExternalLink, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  createdAt: string;
  technology: string;
}

interface ProjectsListProps {
  projects: Project[];
}

export const ProjectsList = ({ projects }: ProjectsListProps) => {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 px-6 rounded-xl bg-secondary/30 border border-border"
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
          <Code2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h4 className="text-lg font-semibold text-foreground mb-2">No Projects Yet</h4>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
          Start generating your first application and it will appear here.
        </p>
        <Button
          onClick={() => navigate('/generate')}
          className="bg-primary hover:bg-primary/90"
        >
          Create Your First Project
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/30 transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Folder className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {project.name}
              </h4>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
                  {project.technology}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
};
