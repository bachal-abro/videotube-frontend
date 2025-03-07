import React from "react";
import VideoUploadView from "./VideoUploadView";
const UploadFinalStep = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <VideoUploadView />
      <label
        htmlFor="playlist"
        className="flex flex-col mb-2 gap-2 text-sm font-medium text-white w-40"
      >
        Set visiblity
        <select
          id="playlist"
          className="text-sm rounded-lg block p-2.5 shadow-smrounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-white focus-within:ring-1 focus-within:ring-white bg-gray-900 w-full"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </label>
    </div>
  );
};

export default UploadFinalStep;
