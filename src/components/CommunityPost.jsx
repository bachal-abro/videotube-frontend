import React from "react";
import Container from "./containers/Container";
import { AiFillDislike, AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { MdOutlineComment } from "react-icons/md";
import { TbShare3 } from "react-icons/tb";

const CommunityPost = () => {
  return (
    <Container>
      <div className="flex float-start gap-3 mt-2 text-white">
        <img
          className="h-9 w-9 mt-1 rounded-full sm:block"
          src="/profile-default.svg"
          alt=""
        />
        <div>
          <div className="flex gap-2">
            <p className="text-sm font-medium">Demo User</p>
            <p className="text-sm text-gray-400">5 hours ago</p>
          </div>
          <h2>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda numquam tempora dolore ducimus ut est eligendi, earum sapiente, corrupti enim placeat facilis fugiat incidunt repellat dolorum. Ab blanditiis maiores laudantium autem in.
          </h2>
          {/* // IDEA: Image here */}
          <div className="flex my-2 gap-4">
            <span className="flex gap-1 justify-center items-center">
              <AiOutlineLike />
              <AiFillLike className="hidden" />
              10k
            </span>
            <span className="flex gap-1 justify-center items-center">
              <AiOutlineDislike />
              <AiFillDislike className="hidden" />
              50
            </span>
            <span className="flex gap-1 justify-center items-center">
              <MdOutlineComment />
              653
            </span>
            <span className="flex gap-1 justify-center items-center">
              <TbShare3 />
            </span>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CommunityPost;
