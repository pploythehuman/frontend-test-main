import { useState } from "react";
import AppSidebar from "./layout/AppSideBar";
import MainLayout from "./layout/MainLayout";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen gap-4 bg-neutral-100 p-4">
      <AppSidebar />
      <MainLayout />
    </div>
  );
}

export default App;
