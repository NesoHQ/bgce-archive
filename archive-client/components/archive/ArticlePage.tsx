import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { ArchiveRightSidebar } from "./ArchiveRightSidebar";

const ArticlePage = () => {
  return (
    <>
      <div className="mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8">
            <div className="">
              {/* Header */}
              <div className="py-4 bg-[#EEEEFA] dark:bg-gray-700 px-4 lg:px-47 3xl:px-40">
                <h1 className="text-[28px] lg:text-[32px] font-bold text-black dark:text-white">
                  Implementing a Governance Framework for Amazon EMR on EC2
                  Version Upgrades
                </h1>
                <div className="flex items-center gap-2 text-[14px] text-[#545b64] dark:text-gray-400">
                  <span>11 minute read</span>
                  <span>|</span>
                  <span>Content level: Intermediate</span>
                </div>
              </div>

              {/* Vote Section */}
              <div className="flex items-start gap-4 bg-white dark:bg-gray-900 p-6 px-4 lg:px-47">
                {/* Left Vote Section */}
                <div className="flex flex-col items-center justify-start text-gray-500 dark:text-gray-400 space-y-2">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    1
                  </span>
                  <ThumbsDown className="w-5 h-5" />
                </div>

                {/* Right Content Section */}
                <div className="text-gray-700 dark:text-gray-300 italic leading-relaxed text-[15px]">
                  <p>
                    Enterprises struggle with EMR version upgrades, facing
                    challenges like production downtime, performance
                    degradation, and compliance risks. Without a structured
                    approach, organizations often experience failed upgrades,
                    cost overruns and vulnerabilities.
                  </p>
                  <p className="mt-2">
                    This article introduces a governance framework that helps
                    streamline EMR upgrades through centralized decision-making,
                    testing, and controlled deployment strategies, enabling
                    successful upgrades while maintaining stability & regulatory
                    compliance.
                  </p>

                  <hr className="mt-4 dark:border-gray-600" />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-10/12 mx-auto px-4 lg:px-8 mb-10">
              {/* Introduction Section */}
              <div className="lg:px-18">
                <h2 className="text-[22px] font-bold text-black dark:text-white mb-5">
                  Introduction
                </h2>
                <div className="space-y-5 text-[15px] leading-[1.75] text-[#16191f] dark:text-gray-300">
                  <p>
                    Organizations running big data workloads on Amazon EMR face
                    significant challenges when upgrading their EMR versions.
                    These challenges often include ensuring production
                    stability, maintaining performance standards, managing
                    costs, and meeting security requirements. While version
                    upgrades bring valuable benefits such as performance
                    improvements and security patches, the process requires
                    careful planning and execution to minimize risks and
                    disruption to business operations.
                  </p>
                  <p>
                    This article introduces a comprehensive governance framework
                    for EMR version upgrades, designed to help organizations
                    implement a structured, reliable approach to their upgrade
                    initiatives. The framework addresses common pain points such
                    as unexpected performance issues, compatibility problems,
                    and the need for proper validation before production
                    deployment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 px-4 lg:px-0 lg:mr-10">
            <ArchiveRightSidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;
