import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-slate-50 py-12 ${className}`}>
      <div className="container px-4">
        {children}
      </div>
    </div>
  );
}
