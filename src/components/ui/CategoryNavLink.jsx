import React from "react";
import { NavLink } from "react-router-dom";
const CategoryNavLink = ({ children, to = "", className = "", ...props }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `shrink-0 rounded-lg p-2 text-sm font-medium ${className} ${
          isActive
            ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-50"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-200"
        }`
      }
      {...props}
    >
      {children}
    </NavLink>
  );
};

export default CategoryNavLink;
