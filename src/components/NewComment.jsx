import React from "react";
import { Form } from "react-router-dom";

const NewComment = () => {
  return (
    <Form method="POST" className="sm:flex flex-col items-end hidden">
      <div className="flex flex-col gap-4 w-full mb-2">
        <div className="flex gap-2">
          <img
            className="h-10 w-10 rounded-full sm:block"
            src="/profile-default.svg"
            alt=""
          />
          <label
            htmlFor="message"
            className="flex flex-col text-sm font-medium text-gray-900 dark:text-white"
          >
            <span>Comment as</span>
            <p className="text-blue-400">Muhammad_Bachal</p>
          </label>
        </div>
        <textarea
          id="message"
          rows="4"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
          placeholder="Say something about this..."
        ></textarea>
      </div>
      <div className="flex gap-2">
        <button
          type="reset"
          className="px-4 py-2 rounded-3xl bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-600"
        >
          <span className="flex gap-1 justify-center items-center">Cancel</span>
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-3xl border-blue-500 bg-blue-700 text-black hover:bg-blue-200 dark:bg-blue-600 dark:hover:bg-blue-500/20 dark:text-white"
        >
          <span className="flex gap-1 justify-center items-center">
            Comment
          </span>
        </button>
      </div>
    </Form>
  );
};

export default NewComment;