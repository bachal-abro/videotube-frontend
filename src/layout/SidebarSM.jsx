import React from "react";
import { FaHome, FaHistory } from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import { GrChannel } from "react-icons/gr";
import { AiFillLike } from "react-icons/ai";
import { IoSettings } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const SidebarSM = () => {
  return (
    <div className="relative hidden sm:block bg-gray-900">
      <div className="w-14 text-xl min-h-screen"></div>
      <ul className="w-14 text-xl fixed top-16 left-0">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-2 px-4 py-3 ${
                isActive
                  ? "border-s-[3px] border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                  : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              }`
            }
          >
            <FaHome />
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/subscriptions"
            className={({ isActive }) =>
              `flex flex-col items-center gap-2 px-4 py-3 text-white border-gray-100 ${
                isActive
                  ? "border-s-[3px] border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                  : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              }`
            }
          >
            <MdSubscriptions />
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/@username"
            className={({ isActive }) =>
              `flex flex-col items-center gap-2 px-4 py-3 text-white border-gray-100 ${
                isActive
                  ? "border-s-[3px] border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                  : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              }`
            }
          >
            <GrChannel />
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex flex-col items-center gap-2 px-4 py-3 text-white border-gray-100 ${
                isActive
                  ? "border-s-[3px] border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                  : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              }`
            }
          >
            <FaHistory />
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/liked"
            className={({ isActive }) =>
              `flex flex-col items-center gap-2 px-4 py-3 text-white border-gray-100 ${
                isActive
                  ? "border-s-[3px] border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                  : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              }`
            }
          >
            <AiFillLike />
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex flex-col items-center gap-2 px-4 py-3 text-white border-gray-100 ${
                isActive
                  ? "border-s-[3px] border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                  : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              }`
            }
          >
            <IoSettings />
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SidebarSM;
