import React, { useState } from "react";
import UploadFirstStep from "../components/UploadFirstStep";
import UploadSecondStep from "../components/UploadSecondStep";
import UploadFinalStep from "../components/UploadFinalStep";
import Steps from "../components/Steps";
import { Form } from "react-router-dom";

const stepComponents = [
  <UploadFirstStep />,
  <UploadSecondStep />,
  <UploadFinalStep />,
];
const CreateContent = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) {
      setStep((step) => step + 1);
    }
  };

  return (
    <div className="flex flex-col w-full items-center sm:mr-44">
      <div className="w-2/3 text-gray-500 mt-6">
        <div className="border bg-gray-800 border-gray-800 w-full rounded-3xl p-4">
          <h1 className="text-white text-lg mb-2 font-bold">Upload Video</h1>
          <Steps step={step} />
          <Form method="POST">
            <div className="flex flex-col mt-4 px-6 items-end gap-4">
              <StepComponents step={step} />
              <button
                type={step == 3 ? "submit" : "button"}
                className="px-4 py-2 text-white bg-gray-600 hover:bg-white hover:text-gray-900 rounded-xl"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

const StepComponents = ({ step }) => {
  return <> {stepComponents[step - 1]} </>;
};

export default CreateContent;
