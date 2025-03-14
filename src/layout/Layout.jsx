import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="bg-white dark:bg-gray-900 text-white min-w-fit min-h-screen">
            <Header />
            <div className="flex">
                <span className="">
                    <Sidebar />
                </span>
                <span className="hidden">{/* <SidebarSM /> */}</span>
                <Outlet />
            </div>
            {/* <BottomNavigation /> */}
        </div>
    );
};

export default Layout;
