import AppSidebar from "./layout/AppSideBar";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <MainLayout />
    </div>
  );
}

export default App;
