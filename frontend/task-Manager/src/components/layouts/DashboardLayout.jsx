import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import SideMenu from "./SideMenu";
import Navbar from "./Navbar";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">User not authenticated</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeMenu={activeMenu} />

      <div className="flex">
        {/* Desktop SideMenu */}
        <aside className="max-[1080px]:hidden">
          <SideMenu activeMenu={activeMenu} />
        </aside>

        {/* Main content: padded for fixed navbar height ~72px */}
        <main className="grow px-4 pt-[72px] pb-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
