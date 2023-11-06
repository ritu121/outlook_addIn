import React from 'react';

const CloseButton = ({ onClose }) => (
  <div>
    <button
      onClick={onClose}
      className="py-3 w-full text-xl text-white bg-slt-blue hover:bg-slt-blue-light rounded-2xl">
      <span>Close</span>
    </button>
  </div>
);

const SubmittedComponent = ({onClose}) => (
  <div className="flex h-[calc(100vh-104px)] flex-col justify-center items-center  pl-10 pr-10 pb-6">
    <div className="pt-6 pb-8 px-6 rounded-2xl shadow-xl z-20 border border-gray-200 bg-gray-50">
      <div className="flex justify-center text-green-700 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-check-circle w-12 h-12 mx-2"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <div className="bg-green-100 rounded-lg p-3 mb-6 ">
        <div className="font-medium">Submitted!</div>
        <div>Email submitted to Selltis successfully.</div>
      </div>
      <CloseButton onClose={onClose} />
    </div>
  </div>
);

export default SubmittedComponent;
