import React from 'react';
import CloseButton from './CloseButton';

const ErrorComponent = ({onClose}) => (
  <div className="flex h-[calc(100vh-104px)] flex-col justify-center items-center  pl-10 pr-10 pb-6">
    <div className="pt-6 pb-8 px-6 rounded-2xl shadow-xl z-20 border border-gray-200 bg-gray-50">
      <div className="flex justify-center text-red-700 mb-6">
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
          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div className="bg-red-50 rounded-lg p-3 mb-6 ">
        <div className="font-medium">Error!</div>
        <div>Error while submitting the Email. Please try again.</div>
      </div>
      <CloseButton onClose={onClose} />
    </div>
  </div>
);

export default ErrorComponent;
