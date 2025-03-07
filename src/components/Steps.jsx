import React from "react";

const Steps = ({ step }) => {
  return (
    <div>
      <h2 className="sr-only">Steps</h2>
      <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100">
        <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-500">
          <li className="flex items-center gap-2 bg-gray-800 p-2">
            <span
              className={`size-6 rounded-full ${
                step == 1 ? "bg-blue-600 text-white" : "bg-gray-100"
              } text-center text-[10px]/6 font-bold `}
            >
              1
            </span>
            <span className="hidden sm:block"> Select video </span>
          </li>

          <li className="flex items-center gap-2 bg-gray-800 p-2">
            <span
              className={`size-6 rounded-full ${
                step == 2 ? "bg-blue-600 text-white" : "bg-gray-100"
              } text-center text-[10px]/6 font-bold `}
            >
              2
            </span>

            <span className="hidden sm:block"> Details </span>
          </li>

          <li className="flex items-center gap-2 bg-gray-800 p-2">
            <span
              className={`size-6 rounded-full ${
                step == 3 ? "bg-blue-600 text-white" : "bg-gray-100"
              } text-center text-[10px]/6 font-bold `}
            >
              3
            </span>

            <span className="hidden sm:block"> Upload </span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Steps;
