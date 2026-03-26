"use client";

import React from "react";
import { Award, Lock } from "lucide-react";

export default function CertificateCard() {
  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-6xl px-4 mx-auto p-4 sm:p-5 bg-white dark:bg-[#0f1117] border border-gray-100 dark:border-gray-800 rounded-xl font-sans">
        
        {/* Inner Gray Container */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#f8f9fa] dark:bg-gray-800/30 p-5 sm:p-8 rounded-lg gap-8">
          
          {/* Left Content */}
          <div className="flex flex-col items-start max-w-lg w-full">
            {/* Icon Badge */}
            <div className="w-9 h-9 mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm">
              <Award size={18} className="text-gray-900 dark:text-gray-100" strokeWidth={1.5} />
            </div>
            
            {/* Text Content */}
            <h2 className="text-[20px] font-medium text-gray-900 dark:text-gray-100 mb-2">
              Certificate of Completion
            </h2>
            <p className="text-[15px] text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
              Showcase your accomplishment by sharing your certificate of completion.
            </p>
            
            {/* Disabled Button */}
            <button 
              disabled 
              className="px-4 py-2 bg-[#e9ecef] dark:bg-gray-800 text-[#adb5bd] dark:text-gray-500 text-sm font-medium rounded-md cursor-not-allowed transition-colors"
            >
              Claim Certificate
            </button>
          </div>

          {/* Right Content (Certificate Mockup) */}
          <div className="relative shrink-0 w-full sm:w-77.5 h-52.5 bg-white dark:bg-[#0f1117] border border-indigo-500 dark:border-indigo-500/70 p-1 flex flex-col items-center justify-center select-none overflow-hidden">
            
            {/* Inner Faux Border to make it look like a document */}
            <div className="w-full h-full border border-gray-100 dark:border-gray-800/80 p-4 flex flex-col items-center relative">
              
              {/* Faded Certificate Details (Opacity reduced) */}
              <div className="w-full h-full flex flex-col items-center opacity-30 dark:opacity-20">
                {/* Logo Mock */}
                <div className="w-10 h-10 rounded-full border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mb-3">
                   <div className="w-5 h-5 rounded-full border border-indigo-200 dark:border-indigo-800"></div>
                </div>
                
                {/* Faux Text Lines */}
                <div className="h-1 w-1/2 bg-gray-400 dark:bg-gray-500 rounded-full mb-3"></div>
                <div className="h-1.5 w-3/4 bg-gray-400 dark:bg-gray-500 rounded-full mb-2"></div>
                <div className="h-1.5 w-2/4 bg-gray-400 dark:bg-gray-500 rounded-full mb-4"></div>

                {/* Bottom Signatures */}
                <div className="w-full flex justify-between mt-auto px-4">
                  <div className="w-16 h-[1.5px] bg-gray-400 dark:bg-gray-600"></div>
                  <div className="w-16 h-[1.5px] bg-gray-400 dark:bg-gray-600"></div>
                </div>
              </div>

              {/* Lock Icon Overlay (Exactly in the center) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock size={36} className="text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}