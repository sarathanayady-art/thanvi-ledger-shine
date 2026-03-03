import { ReactNode } from "react";
import AppTopBar from "./AppSidebar";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <AppTopBar />
      <main className="p-6 md:p-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
