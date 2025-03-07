import React, { useState } from "react";
import { MdFileUpload } from "react-icons/md";
const UploadFirstStep = () => {
  const [videoPath, setVideoPath] = useState("");

  return (
    <div className="flex flex-col gap-4 w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full rounded-lg cursor-pointer text-center py-28"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {videoPath ? (
            <img src={videoPath} alt="" />
          ) : (
            <MdFileUpload className="text-8xl text-white" />
          )}
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
        <input
          id="dropzone-file"
          type="file"
          onChange={(event) => setVideoPath(event.target.value)}
          className="hidden"
        />
      </label>
      {console.log(videoPath)}
    </div>
  );
};

export default UploadFirstStep;
