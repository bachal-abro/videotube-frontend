import React from "react";

const Container = ({ children }) => {
  return <div className="mx-1 sm:w-2/3 min-h-32 border border-gray-600 p-4">{children}</div>;
};

export default Container;
