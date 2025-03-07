import React from "react";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { MdOutlineQuickreply } from "react-icons/md";
import { Link } from "react-router-dom";

const Comment = ({comment}) => {
  return (
    <div className="flex gap-3 items-start px-1">
      <img
        className="h-10 w-10 rounded-full sm:block"
        src="/profile-default.svg"
        alt=""
      />
      <div>
        <div className="flex gap-2">
          <Link to="/@username" className="text-sm font-medium text-blue-400">
            Demo User
          </Link>
          <p className="text-sm text-gray-400">5 hours ago</p>
        </div>
        <h2 className="text-sm sm:text-md">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque, accusantium cumque nobis consequatur ab voluptatum eveniet, inventore velit aliquid qui natus consectetur expedita neque totam fugiat! Fuga dolores ut explicabo sunt nostrum.
        </h2>
        <div className="flex gap-4 text-sm sm:text-md">
          {/* // Todo: Make button components */}
          <button
            type="button"
            className="flex gap-1 justify-center items-center rounded-full text-black font-medium dark:text-gray-400 border-gray-200 dark:hover:text-blue-400"
          >
              <MdOutlineQuickreply  />
              Reply
          </button>
          <button
            type="button"
            className="flex gap-1 justify-center items-center rounded-full text-black font-medium dark:text-gray-400 border-gray-200 dark:hover:text-blue-400"
          >
              <AiOutlineLike  />
              <AiFillLike className="hidden" />
              10k
          </button>
          <button
            type="button"
            className="flex gap-1 justify-center items-center rounded-full text-black font-medium dark:text-gray-400 border-gray-200 dark:hover:text-blue-400"
          >
              <AiOutlineDislike  />
              <AiFillDislike className="hidden" />
              50
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
