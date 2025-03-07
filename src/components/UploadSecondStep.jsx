import React from "react";
import { MdFileUpload } from "react-icons/md";
const UploadSecondStep = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <label
        htmlFor="VideoTitle"
        className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-white focus-within:ring-1 focus-within:ring-white dark:border-gray-700 dark:bg-gray-800 w-full"
      >
        <span className="text-xs font-medium text-gray-200">Title</span>

        <input
          type="text"
          id="VideoTitle"
          placeholder="Add a title which describes your video"
          className="mt-1 w-full border-none bg-transparent p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm text-white"
        />
      </label>

      <label
        htmlFor="VideoTitle"
        className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-white focus-within:ring-1 focus-within:ring-white dark:border-gray-700 dark:bg-gray-800 w-full"
      >
        <span className="text-xs font-medium text-gray-200">Description</span>

        <textarea
          type="text"
          id="VideoDescription"
          placeholder="Tell viewers about your video"
          rows={10}
          className="mt-1 w-full border-none bg-transparent p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm text-white"
        />
      </label>

      <label
        htmlFor="dropzone-file"
        className="flex flex-col w-full cursor-pointer rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-white focus-within:ring-1 focus-within:ring-white dark:border-gray-700"
      >
        <span className="text-xs font-medium text-gray-200">Thumbnail</span>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <MdFileUpload className="text-8xl text-white" />
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold">Click to browse</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Drag and drop video files to upload
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your videos will be private until you publish them.
          </p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" />
      </label>

      <label
        htmlFor="playlist"
        className="flex flex-col mb-2 gap-2 text-sm font-medium text-white w-full"
      >
        Select an option
        <select
          id="playlist"
          className="text-sm rounded-lg block p-2.5 shadow-smrounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-white focus-within:ring-1 focus-within:ring-white bg-gray-900 w-full"
        >
          <option value="">Choose a playlist</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="FR">France</option>
          <option value="DE">Germany</option>
        </select>
      </label>
    </div>
  );
};

export default UploadSecondStep;
