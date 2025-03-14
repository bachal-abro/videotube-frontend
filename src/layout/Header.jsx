import React, { useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiSearch } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoCloudUploadOutline } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import { login } from "../services/api/AuthApi.js";
import LogoutButton from "../components/ui/LogoutButton.jsx";
import { useSelector } from "react-redux";
const Header = () => {
    const uploadDropdown = useRef();
    const profileDropdown = useRef();
    const { user, token } = useSelector((store) => store.auth);
    // console.log(user);

    // console.log(token);
    
    // Todo: Implement
    const navItems = [
        {
            name: "Home",
            url: "/",
            active: true,
        },
        {
            name: "Profile",
            url: "/username",
            active: true,
        },
    ];
    return (
        <div className="relative">
            <div className="h-16"></div>
            <nav className="bg-white shadow dark:bg-gray-900 fixed z-50 w-full top-0 left-0">
                <div className="mx-auto px-2 sm:px-6 lg:px-5">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="flex flex-shrink-0 gap-6 items-center">
                            <button className="hidden sm:block">
                                <GiHamburgerMenu className="dark:text-white text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400 text-xl" />
                            </button>
                            <Link to={"/"}>
                                <div className="logo-container flex">
                                    <img
                                        className="h-8 w-auto"
                                        src="/vite.svg"
                                        alt="VibeVerse"
                                    />
                                    <span className="text-yellow-400 font-bold">
                                        VibeVerse
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <div className="hidden search-container sm:flex border border-gray-200 dark:border-gray-800 dark:bg-gray-900 rounded-l-full rounded-r-full w-[45%]">
                            <input
                                type="text"
                                placeholder="Search"
                                className="search-input w-full bg-white dark:bg-gray-900 px-5 py-2 outline-none dark:text-white rounded-l-full"
                            />
                            <button
                                type="submit"
                                className="search-button bg-gray-100 dark:bg-gray-800 px-5 rounded-r-full"
                            >
                                <FiSearch className="text-black dark:text-white" />
                            </button>
                        </div>
                        <h1 className="text-white">{user?.username}</h1>
                        {/* <LogoutButton /> */}
                        <div className="absolute inset-y-0 right-0 gap-2 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <div className="relative">
                                <IoCloudUploadOutline
                                    className="bg-white dark:bg-gray-900 p-1 text-gray-900 dark:text-gray-300 hover:text-black dark:hover:text-white text-3xl"
                                    onClick={() => {
                                        let uploadDropdownClasses =
                                            uploadDropdown.current.className;
                                        uploadDropdownClasses.includes("hidden")
                                            ? (uploadDropdown.current.className =
                                                  "absolute right-0 z-20 mt-2 w-32 origin-top-right rounded-md bg-gray-200 dark:bg-gray-800 py-1 shadow-lg")
                                            : (uploadDropdown.current.className +=
                                                  " hidden");
                                    }}
                                />

                                <div
                                    className="absolute right-0 z-50 mt-2 w-32 origin-top-right rounded-md py-1 shadow-l hidden"
                                    ref={uploadDropdown}
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu-button"
                                    tabIndex="-1"
                                    onClick={() => {
                                        let uploadDropdownClasses =
                                            uploadDropdown.current.className;
                                        uploadDropdownClasses.includes("hidden")
                                            ? (uploadDropdown.current.className =
                                                  "absolute right-0 z-20 mt-2 w-32 origin-top-right rounded-md bg-gray-200 dark:bg-gray-800 py-1 shadow-lg")
                                            : (uploadDropdown.current.className +=
                                                  " hidden");
                                    }}
                                >
                                    {/* <NavLink
                    to="/create/video"
                    className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-300 dark:hover:text-white hover:text-black"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                  >
                    Upload video
                  </NavLink> */}
                                    {/* <NavLink
                    to="/create/post"
                    className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-300 dark:hover:text-white hover:text-black"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-1"
                  >
                    Create post
                  </NavLink> */}
                                </div>
                            </div>
                            <IoNotificationsOutline className="bg-white dark:bg-gray-900 p-1 text-gray-900 dark:text-gray-300 hover:text-black dark:hover:text-white text-3xl" />
                            {/* <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">View notifications</span>
              </button> */}
                            {/* // TODO: Profile profileDropdown   */}
                            <div className="relative ml-1">
                                <div>
                                    <button
                                        type="button"
                                        className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                        id="user-menu-button"
                                        aria-expanded="false"
                                        aria-haspopup="true"
                                        onClick={() => {
                                            let profileDropdownClasses =
                                                profileDropdown.current
                                                    .className;
                                            profileDropdownClasses.includes(
                                                "hidden"
                                            )
                                                ? (profileDropdown.current.className =
                                                      "absolute right-0 z-20 mt-2 w-32 origin-top-right rounded-md bg-gray-200 dark:bg-gray-800 py-1 shadow-lg")
                                                : (profileDropdown.current.className +=
                                                      " hidden");
                                        }}
                                    >
                                        <span className="absolute -inset-1.5"></span>
                                        <span className="sr-only">
                                            Open user menu
                                        </span>
                                        <img
                                            className="h-8 w-8 rounded-full hidden sm:block"
                                            src="/profile-default.svg"
                                            alt=""
                                        />
                                    </button>
                                </div>

                                {/*// TODO:
                Dropdown menu, show/hide based on menu state.
                Entering: "transition ease-out duration-100"
                  From: "transform opacity-0 scale-95"
                  To: "transform opacity-100 scale-100"
                Leaving: "transition ease-in duration-75"
                  From: "transform opacity-100 scale-100"
                  To: "transform opacity-0 scale-95"
                */}
                                <div
                                    className="absolute right-0 z-20 mt-2 w-32 origin-top-right rounded-md dark:b`g-gray-800 py-1 shadow-lg hidden"
                                    ref={profileDropdown}
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu-button"
                                    tabIndex="-1"
                                >
                                    {/* // TODO: Active: "bg-gray-100", Not Active: ""   */}
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-900 hover:text-black dark:text-gray-300 dark:hover:text-white"
                                        role="menuitem"
                                        tabIndex="-1"
                                        id="user-menu-item-0"
                                    >
                                        Your Profile
                                    </a>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white"
                                        role="menuitem"
                                        tabIndex="-1"
                                        id="user-menu-item-1"
                                    >
                                        Settings
                                    </a>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white"
                                        role="menuitem"
                                        tabIndex="-1"
                                        id="user-menu-item-2"
                                    >
                                        Sign out
                                    </a>
                                </div>
                            </div>
                            <button className="block sm:hidden">
                                <FiSearch className="text-white text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Header;
