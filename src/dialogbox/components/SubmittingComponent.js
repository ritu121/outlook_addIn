import React from 'react';
import logoSquare from '../../../assets/s-icon-32.png';


const SubmittingComponent = () => (
  <div className="flex h-[calc(100vh-104px)] flex-col justify-center items-center  pl-10 pr-10 pb-6">
    <div className="pt-6 pb-8 px-6">
      <div className="flex p-10 justify-center items-center">
        <img className="h-10 w-10 animate-spin" src={logoSquare} alt="Selltis" title="Selltis" />
      </div>
      <div className="bg-green-50 rounded-lg p-3 mb-3">
        <div className="font-medium w-52 text-center">Submitting...</div>
      </div>
    </div>
  </div>
);

export default SubmittingComponent;
