"use client";

import React from 'react';

export const BackgroundVideo = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden pointer-events-none">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4" type="video/mp4" />
      </video>
    </div>
  );
};
