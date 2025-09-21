import React from 'react';

const NewPitch = () => (
  <div className="absolute inset-0 overflow-hidden bg-pitch-dark">
    <div className="h-full w-full">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="h-[calc(100%/12)] w-full bg-pitch-green even:bg-pitch-dark"></div>
      ))}
    </div>
    <div className="absolute inset-8 border-2 border-white/30">
      {/* Center line */}
      <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/30"></div>
      {/* Center circle */}
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/30"></div>
      {/* Center spot */}
      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30"></div>
      
      {/* Top penalty box */}
      <div className="absolute left-1/2 top-0 h-48 w-[40%] -translate-x-1/2 border-x-2 border-b-2 border-white/30"></div>
      {/* Top goal box */}
      <div className="absolute left-1/2 top-0 h-20 w-[20%] -translate-x-1/2 border-x-2 border-b-2 border-white/30"></div>
      {/* Top penalty arc */}
      <div className="absolute left-1/2 top-[192px] h-20 w-40 -translate-x-1/2 rounded-b-full border-2 border-t-0 border-white/30"></div>
      {/* Top penalty spot */}
      <div className="absolute left-1/2 top-28 h-1 w-1 -translate-x-1/2 rounded-full bg-white/30"></div>

      {/* Bottom penalty box */}
      <div className="absolute left-1/2 bottom-0 h-48 w-[40%] -translate-x-1/2 border-x-2 border-t-2 border-white/30"></div>
      {/* Bottom goal box */}
      <div className="absolute left-1/2 bottom-0 h-20 w-[20%] -translate-x-1/2 border-x-2 border-t-2 border-white/30"></div>
      {/* Bottom penalty arc */}
      <div className="absolute left-1/2 bottom-[192px] h-20 w-40 -translate-x-1/2 rounded-t-full border-2 border-b-0 border-white/30"></div>
      {/* Bottom penalty spot */}
      <div className="absolute left-1/2 bottom-28 h-1 w-1 -translate-x-1/2 rounded-full bg-white/30"></div>
    </div>
  </div>
);

export default NewPitch;