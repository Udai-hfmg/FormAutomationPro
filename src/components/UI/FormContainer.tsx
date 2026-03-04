import React from "react";

type Props = {
  children: React.ReactNode;
};

const FormContainer = ({ children }: Props) => {
  return (
    <div className="flex justify-center bg-gray-100  py-10 px-4">
      <div
        className="
          bg-white
          shadow-lg
          border
        
      
          max-w-[210mm]
          min-h-[330mm]
          p-10
          
          print:w-[210mm]
          print:min-h-[330mm]
          print:shadow-none
          print:border-none
        "
      >
        {children}
      </div>
    </div>
  );
};

export default FormContainer;