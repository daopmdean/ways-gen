import React from "react";
import { Bell, FileText } from "lucide-react";
import { WaysStationIcon } from "./icons/WaysStationIcon";

interface BottomNavBarProps {
  notificationCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  notificationCount,
}) => {
  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[353px] h-[65px] bg-white rounded-full px-3 shadow-[0_2px_12px_rgba(0,0,0,0.12)] z-20 flex items-center"
    >
      <div className="w-full grid grid-cols-5 items-end">
        {/* 1. Trang chủ */}
        <div className="flex flex-col items-center justify-center gap-1.5 text-[#0D0D0D] select-none">
          <div className="h-[22px] flex items-center justify-center">
            <WaysStationIcon
              className="w-[34px] h-[16px] text-[#0D0D0D]"
              aria-hidden="true"
            />
          </div>
          <span className="text-[10px] font-normal leading-none">
            Trang chủ
          </span>
        </div>

        {/* 2. Hợp đồng */}
        <div className="flex flex-col items-center justify-center gap-1.5 text-[#0D0D0D] select-none">
          <div className="w-[22px] h-[22px] flex items-center justify-center">
            <FileText className="w-[19px] h-[19px] stroke-[1.7]" />
          </div>
          <span className="text-[10px] font-normal leading-none">
            Hợp đồng
          </span>
        </div>

        {/* 3. Tập luyện (Active) */}
        <div className="flex flex-col items-center justify-center gap-1.5 text-[#0999ED] select-none">
          <div className="w-[22px] h-[22px] flex items-center justify-center">
            {/* Filled smartwatch icon matching Ways Station active tab */}
            <svg
              viewBox="0 0 24 24"
              className="w-[20px] h-[20px]"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9.2 2H14.8L15.4 5.2H8.6L9.2 2Z"
                fill="currentColor"
              />
              <path
                d="M8.6 18.8H15.4L14.8 22H9.2L8.6 18.8Z"
                fill="currentColor"
              />
              <rect
                x="5.5"
                y="4.5"
                width="13"
                height="15"
                rx="3.5"
                fill="currentColor"
              />
              <rect
                x="7.3"
                y="6.3"
                width="9.4"
                height="11.4"
                rx="2"
                stroke="#FFFFFF"
                strokeWidth="1.2"
              />
              <rect
                x="18.5"
                y="9.5"
                width="1.3"
                height="3.2"
                rx="0.65"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="text-[10px] font-medium leading-none">
            Tập luyện
          </span>
        </div>

        {/* 4. Thông báo */}
        <div className="flex flex-col items-center justify-center gap-1.5 text-[#0D0D0D] select-none">
          <div className="relative w-[22px] h-[22px] flex items-center justify-center">
            <Bell className="w-[19px] h-[19px] stroke-[1.7]" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[18px] h-[14px] px-1 rounded-full bg-[#FF0000] text-white text-[9.5px] font-bold flex items-center justify-center leading-none tabular-nums">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-normal leading-none">
            Thông báo
          </span>
        </div>

        {/* 5. Tài khoản */}
        <div className="flex flex-col items-center justify-center gap-1.5 text-[#0D0D0D] select-none">
          <div className="w-[22px] h-[22px] flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-[19px] h-[19px]"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="7.5"
                r="3.6"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M5 18.6C5 15.5 8.1 13.5 12 13.5C15.9 13.5 19 15.5 19 18.6C19 19.65 18.15 20.5 17.1 20.5H6.9C5.85 20.5 5 19.65 5 18.6Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[10px] font-normal leading-none">
            Tài khoản
          </span>
        </div>
      </div>
    </nav>
  );
};
