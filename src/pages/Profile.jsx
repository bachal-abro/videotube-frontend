import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import SeparaterHr from "../components/SeparaterHr";
import CategoryNavigation from "../components/CategoryNavigation";
import { useSelector } from "react-redux";
const Profile = () => {
  const { user, token } = useSelector((store) => store.auth);
  console.log(user);
  const categoryItems = [
    {
      name: "Home",
      url: `/@${user?.username}`,
      active: true,
    },
    {
      name: "Videos",
      url: "/@username/videos",
      active: true,
    },
    {
      name: "Playlists",
      url: "/@username/playlists",
      active: true,
    },
    {
      name: "Community",
      url: "/@username/Community",
      active: true,
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-3 min-w-full sm:mt-2 sm:px-6 lg:px-0 text-gray-300 dark:bg-gray-900">
        <img className="rounded-xl h-28 sm:h-56" src="/banner.jpg" alt="" />
        <div className="flex flex-col min-w-full sm:justify-between sm:items-start gap-3 px-2 sm:px-6 dark:bg-gray-900  text-gray-300">
          <div className="flex items-center gap-3 px-1 sm:px-0 dark:bg-gray-900">
            <img
              className="h-28 w-28 sm:h-40 sm:w-40 mt-1 rounded-full sm:block"
              src="/profile-default.svg"
              alt=""
            />
            <div className="flex flex-col sm:gap-2 dark:bg-gray-900">
              <h1 className="text-white text-xl sm:text-4xl font-bold">
                Demo User
              </h1>
              <p className="text-sm">@{user.username}</p>
              <p className="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa,
                nostrum quae? Tenetur, odit facere! Tempore architecto error
                nobis dolorum voluptatibus cumque quos blanditiis exercitationem
                amet voluptatem, fuga sunt consectetur esse ipsa perspiciatis?
              </p>

              <div className="flex gap-3">
                <div className="flex flex-col rounded-lg text-center">
                  <dt className="order-last text-xs font-medium text-gray-300 dark:text-white/75">
                    Subscribers
                  </dt>

                  <dd className="text-md font-extrabold text-white md:text-xl dark:text-blue-50">
                    23M
                  </dd>
                </div>
                <div className="flex flex-col rounded-lg text-center ">
                  <dt className="order-last text-xs font-medium text-gray-300 dark:text-white/75">
                    Videos
                  </dt>
                  <dd className="text-md font-extrabold text-white md:text-xl dark:text-blue-50">
                    27
                  </dd>
                </div>
                <div className="flex flex-col rounded-lg text-center ">
                  <dt className="order-last text-xs font-medium text-gray-300 dark:text-white/75">
                    Views
                  </dt>

                  <dd className="text-md font-extrabold text-white md:text-xl dark:text-blue-50">
                    6,502,019
                  </dd>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col text-center mt-2">
              <a
                href="#"
                className="shrink-0 rounded-2xl p-2 text-sm font-medium sm:w-36 border-blue-500 bg-blue-700 text-black hover:bg-blue-200 dark:bg-blue-600 dark:hover:bg-blue-500/20 dark:text-white"
              >
                Subscribe
              </a>

              <button className="bg-gray-600 px-3 py-1 rounded-2xl hidden">
                Subscribed
              </button>
            </div>
          </div>
        </div>
        <CategoryNavigation>{categoryItems}</CategoryNavigation>
        <SeparaterHr />
      </div>
      <Outlet />
    </div>
  );
};

export default Profile;
