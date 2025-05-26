import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import { useState } from "react";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex items-center gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4">
      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setOpenSideMenu(!openSideMenu)}
        className="block lg:hidden text-black"
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      {/* Logo or Title */}
      <h1 className="text-lg font-semibold text-gray-800">My App</h1>

      {/* Conditional SideMenu for mobile */}
      {openSideMenu && (
        <div className="fixed top-[61px] left-0 w-full z-40 bg-white shadow">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
