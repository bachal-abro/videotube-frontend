import React from "react";
import CategoryNavLink from "./ui/CategoryNavLink";

const CategoryNavigation = ({
  children,
  className = "",
}) => {
  return (
    <nav>
      <ul
        className={`flex gap-6 my-2 px-8 bg-gray-900 w-full z-10 ${className}`}
        aria-label="Tabs"
      >
        {children.map((item) => (
          <li key={item.name}>
            <CategoryNavLink to={item.url}>{item.name}</CategoryNavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryNavigation;
