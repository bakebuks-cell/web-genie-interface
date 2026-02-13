import { Navbar } from "./Navbar";
import { ParticleBackground } from "./ParticleBackground";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Navbar />
      <main>{children}</main>
    </div>
  );
};
