import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ArchiveRightSidebar = () => {
  return (
    <div className="space-y-4">
      <div className="">
        <h3 className="text-[14px] font-medium text-gray-800 dark:text-gray-200 mb-4">
          Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="bg-[#606F7B] dark:bg-gray-600 text-white text-[12px] px-3 py-0.5 font-medium items-center rounded-full cursor-pointer">
            Machine Learning & AI
          </span>
          <span className="bg-[#606F7B] dark:bg-gray-600 text-white text-[12px] px-3 py-0.5 font-medium items-center rounded-full cursor-pointer">
            Storage
          </span>
          <span className="bg-[#606F7B] dark:bg-gray-600 text-white text-[12px] px-3 py-0.5 font-medium items-center rounded-full cursor-pointer">
            Containers
          </span>
          <span className="bg-[#606F7B] dark:bg-gray-600 text-white text-[12px] px-3 py-0.5 font-medium items-center rounded-full cursor-pointer">
            Generative AI on AWS
          </span>
        </div>
      </div>

      <div className="my-5">
        <h3 className="text-[14px] font-medium text-gray-800 dark:text-gray-200 mb-4">
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="border border-[#d5d9dd] dark:border-gray-600 text-[#16191f] dark:text-gray-300 text-[13px] font-normal px-3 py-0.5 rounded-full hover:text-gray-900 dark:hover:text-white cursor-pointer">
            Amazon CloudWatch
          </span>
          <span className="border border-[#d5d9dd] dark:border-gray-600 text-[#16191f] dark:text-gray-300 text-[13px] font-normal px-3 py-0.5 rounded-full hover:text-gray-900 dark:hover:text-white cursor-pointer">
            Analytics
          </span>
          <span className="border border-[#d5d9dd] dark:border-gray-600 text-[#16191f] dark:text-gray-300 text-[13px] font-normal px-3 py-0.5 rounded-full hover:text-gray-900 dark:hover:text-white cursor-pointer">
            Operational Excellence
          </span>
          <span className="border border-[#d5d9dd] dark:border-gray-600 text-[#16191f] dark:text-gray-300 text-[13px] font-normal px-3 py-0.5 rounded-full hover:text-gray-900 dark:hover:text-white cursor-pointer">
            Amazon EMR
          </span>
        </div>
      </div>

      <div className="my-5">
        <h3 className="text-[14px] font-medium text-gray-800 dark:text-gray-200 mb-4">
          Language
        </h3>
        <span className="text-[14px] text-[#232f3e] dark:text-gray-300 bg-gray-200 dark:bg-gray-700 py-1 px-2 rounded-xs">
          English
        </span>
      </div>

      <div className="my-5">
        <div className="flex gap-4">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/api/placeholder/56/56" />
              <AvatarFallback className="bg-[#2563eb] text-white font-semibold text-lg">
                RA
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <h4 className="text-[15px] font-semibold text-[#0073bb] dark:text-blue-400 hover:underline cursor-pointer">
              Ram Achanta
            </h4>
            <div className="text-[13px] text-[#545b64] dark:text-gray-400 space-y-0.5">
              published 4 hours ago | 28 views
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
