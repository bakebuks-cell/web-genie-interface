-- Create technologies table for storing supported languages/frameworks
CREATE TABLE public.technologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  type text NOT NULL DEFAULT 'language',
  icon text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (technologies are public info)
CREATE POLICY "Technologies are viewable by everyone" 
ON public.technologies 
FOR SELECT 
USING (true);

-- Seed initial data: HTML, CSS, JavaScript
INSERT INTO public.technologies (name, type, icon, description) VALUES
  ('HTML', 'language', '📄', 'The standard markup language for creating web pages'),
  ('CSS', 'language', '🎨', 'Style sheet language for describing presentation of documents'),
  ('JavaScript', 'language', '🟨', 'High-level programming language for web development'),
  ('Plain HTML/CSS/JS', 'stack', '🌐', 'Static web development without frameworks'),
  ('React', 'framework', '⚛️', 'A JavaScript library for building user interfaces'),
  ('Node/TS', 'runtime', '🟢', 'JavaScript runtime with TypeScript support'),
  ('PHP', 'language', '🐘', 'Server-side scripting language'),
  ('Python', 'language', '🐍', 'High-level general-purpose programming language'),
  ('Golang', 'language', '🔵', 'Statically typed compiled language by Google')
ON CONFLICT (name) DO NOTHING;