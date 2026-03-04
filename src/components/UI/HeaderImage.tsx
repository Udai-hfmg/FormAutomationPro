import React from "react";

const HeaderImage = () => {
  return (
    <div className="flex  md:flex-row items-center gap-6 md:gap-16">
      
      <img
        src="/image.png"
        alt="Header"
        className="w-24 sm:w-28 md:w-[120px] h-auto object-contain"
      />

      <div className="bg-gray-200 p-4 sm:p-5 w-full md:w-80 text-black leading-relaxed font-[cursive] text-center md:text-left">
        <div className="font-bold">Women's Health Group</div>
        <div>30 Hatfield Lane, Suite 105</div>
        <div>Goshen, NY 10924</div>
        <div>845-291-7400 x 2</div>
      </div>

    </div>
  );
};

export default HeaderImage;