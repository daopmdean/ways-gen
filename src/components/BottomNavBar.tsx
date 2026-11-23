import React from "react";
import { Bell, FileText, User } from "lucide-react";
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
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[406px] bg-white rounded-[28px] px-2 py-2 shadow-[0_6px_24px_rgba(15,23,42,0.09)] border border-slate-100/90 z-20"
    >
      <div className="grid grid-cols-5 items-end">
        {/* 1. Trang chủ */}
        <div className="flex flex-col items-center justify-center gap-1 py-0.5 text-[#6B7280] select-none">
          <div className="h-6 flex items-center justify-center">
            <WaysStationIcon
              className="w-[32px] h-[15px] text-[#111827]"
              aria-hidden="true"
            />
          </div>
          <span className="text-[10.5px] font-medium leading-none">
            Trang chủ
          </span>
        </div>

        {/* 2. Hợp đồng */}
        <div className="flex flex-col items-center justify-center gap-1 py-0.5 text-[#6B7280] select-none">
          <div className="w-6 h-6 flex items-center justify-center">
            <FileText className="w-[21px] h-[21px] stroke-[1.8]" />
          </div>
          <span className="text-[10.5px] font-medium leading-none">
            Hợp đồng
          </span>
        </div>

        {/* 3. Tập luyện (Active) */}
        <div className="flex flex-col items-center justify-center gap-1 py-0.5 text-[#0095FF] select-none">
          <div className="w-6 h-6 flex items-center justify-center">
            {/* Smartwatch icon matching Ways Station active tab */}
            <svg
              viewBox="0 0 24 24"
              className="w-[22px] h-[22px]"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 2.5H15L15.6 5.5H8.4L9 2.5Z"
                fill="currentColor"
                opacity="0.85"
              />
              <path
                d="M8.4 18.5H15.6L15 21.5H9L8.4 18.5Z"
                fill="currentColor"
                opacity="0.85"
              />
              <rect
                x="5.5"
                y="5"
                width="13"
                height="14"
                rx="3.5"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8.5 12H10.3L11.4 9.6L12.9 14.2L14 12H15.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[10.5px] font-semibold leading-none">
            Tập luyện
          </span>
        </div>

        {/* 4. Thông báo */}
        <div className="flex flex-col items-center justify-center gap-1 py-0.5 text-[#6B7280] select-none">
          <div className="relative w-6 h-6 flex items-center justify-center">
            <Bell className="w-[21px] h-[21px] stroke-[1.8]" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center leading-none tabular-nums">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </div>
          <span className="text-[10.5px] font-medium leading-none">
            Thông báo
          </span>
        </div>

        {/* 5. Tài khoản */}
        <div className="flex flex-col items-center justify-center gap-1 py-0.5 text-[#6B7280] select-none">
          <div className="w-6 h-6 flex items-center justify-center">
            <User className="w-[21px] h-[21px] stroke-[1.8]" />
          </div>
          <span className="text-[10.5px] font-medium leading-none">
            Tài khoản
          </span>
        </div>
      </div>
    </nav>
  );
};
