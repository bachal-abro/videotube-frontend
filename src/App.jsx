import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import BottomNavigation from "./layout/BottomNavigation";
import SidebarSM from "./layout/SidebarSM";

const App = () => {
  return (
    <div className="bg-white dark:bg-gray-900 min-w-fit min-h-screen">
      <Header/>
      <div className="flex">
        <span className="">
          <Sidebar />
        </span>
        <span className="hidden">
          {/* <SidebarSM /> */}
        </span>
        <Outlet />
      </div>
      {/* <BottomNavigation /> */}
    </div>
  );
};

export default App;
