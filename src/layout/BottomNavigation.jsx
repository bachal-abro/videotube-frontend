import React from "react";
import { FaHome } from "react-icons/fa";
import { GrChannel } from "react-icons/gr";
import { IoSettings } from "react-icons/io5";
import { MdSubscriptions } from "react-icons/md";
import { NavLink } from "react-router-dom";

const BottomNavigation = () => {
  return (
    <div className="relative mt-1">
      <div className="h-10"></div>
      <div className="fixed z-50 w-full h-10 -translate-x-1/2 bg-white border border-gray-200 rounded bottom-0 left-1/2 dark:bg-gray-900 dark:border-gray-700 sm:hidden">
        <div className="grid h-full grid-cols-5 mx-auto">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-center gap-2 px-4 ${
                isActive
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                  : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              }`
            }
          >
            <FaHome className="text-2xl" />
          </NavLink>
          <div
            id="tooltip-home"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
          >
            Home
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
          <NavLink
            to="/subscriptions"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-center gap-2 px-4 ${
                isActive
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                  : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              }`
            }
          >
            <MdSubscriptions className="text-2xl" />
          </NavLink>
          <div
            id="tooltip-wallet"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
          >
            Wallet
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
          <div className="flex items-center justify-center">
            <button
              data-tooltip-target="tooltip-new"
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
            >
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 1v16M1 9h16"
                />
              </svg>
              <span className="sr-only">New item</span>
            </button>
          </div>
          <div
            id="tooltip-new"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
          >
            Create new item
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-center gap-2 px-4 ${
                isActive
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                  : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              }`
            }
          >
            <IoSettings className="text-2xl" />
          </NavLink>
          <div
            id="tooltip-settings"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
          >
            Settings
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
          <NavLink
            to="/@username"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-center gap-2 px-4 ${
                isActive
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                  : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              }`
            }
          >
            <GrChannel className="text-2xl" />
          </NavLink>
          <div
            id="tooltip-profile"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
          >
            Profile
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
