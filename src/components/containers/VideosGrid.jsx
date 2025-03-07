import React from "react";

const VideosGrid = ({ children, className }) => {
  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 w-full text-gray-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default VideosGrid;
