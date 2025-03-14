import React from "react";
import { FaHome, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import { GrChannel } from "react-icons/gr";
import { AiFillLike } from "react-icons/ai";
import { IoSettings } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import LogoutButton from "../components/ui/LogoutButton";

const Sidebar = () => {
    return (
        <div className="relative hidden sm:block bg-gray-900">
            <div className="w-48 text-xl min-h-screen"></div>
            <ul className="w-48 text-xl fixed top-16 left-0">
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 ${
                                isActive
                                    ? "border-s-[3px] border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                                    : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            }`
                        }
                    >
                        <FaHome />
                        <span className="text-sm font-medium"> Home </span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to={"/subscriptions"}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 ${
                                isActive
                                    ? "border-s-[3px] border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                                    : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            }`
                        }
                    >
                        <MdSubscriptions />
                        <span className="text-sm font-medium">
                            {" "}
                            Subscriptions{" "}
                        </span>
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/@username"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 ${
                                isActive
                                    ? "border-s-[3px] border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                                    : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            }`
                        }
                    >
                        <GrChannel />

                        <span className="text-sm font-medium">
                            {" "}
                            Your channel{" "}
                        </span>
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to={"/history"}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 ${
                                isActive
                                    ? "border-s-[3px] border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                                    : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            }`
                        }
                    >
                        <FaHistory />
                        <span className="text-sm font-medium"> History </span>
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to={"/liked"}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 ${
                                isActive
                                    ? "border-s-[3px] border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                                    : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            }`
                        }
                    >
                        <AiFillLike />

                        <span className="text-sm font-medium">
                            {" "}
                            Liked videos{" "}
                        </span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to={"/settings"}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 ${
                                isActive
                                    ? "border-s-[3px] border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                                    : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            }`
                        }
                    >
                        <IoSettings />

                        <span className="text-sm font-medium"> Settings </span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to={"/logout"}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 ${
                                isActive
                                    ? "border-s-[3px] border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
                                    : "border-gray-100 border-transparent text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            }`
                        }
                    >
                        <FaSignOutAlt />
                        <LogoutButton />
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
