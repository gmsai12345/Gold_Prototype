import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-t-[#D4AF37] border-r-[#D4AF37] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#D4AF37] font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;