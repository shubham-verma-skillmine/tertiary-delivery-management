import type { ReactNode } from "react";
import TopBar from "./components/TopBar";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col overflow-hidden">
      <TopBar />
      {children}
    </div>
  );
};

export default MainLayout;
