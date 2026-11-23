import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarCell } from '../types/checkin';
import { WEEKDAY_LABELS, formatMonthYear } from '../utils/calendar';

interface MonthlySummaryCardProps {
  month: number;
  year: number;
  untrainedCount: number;
  trainedCount: number;
  cells: CalendarCell[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const MonthlySummaryCard: React.FC<MonthlySummaryCardProps> = ({
  month,
  year,
  untrainedCount,
  trainedCount,
  cells,
  onPrevMonth,
  onNextMonth,
}) => {
  return (
    <div className="bg-white rounded-[20px] p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Blue Bar Chart Icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#0095FF] shrink-0"
            aria-hidden="true"
          >
            <rect x="3" y="12" width="4.5" height="9" rx="1.5" fill="currentColor" />
            <rect x="9.75" y="5" width="4.5" height="16" rx="1.5" fill="currentColor" />
            <rect x="16.5" y="9" width="4.5" height="12" rx="1.5" fill="currentColor" />
          </svg>
          <h2 className="text-[15px] font-bold text-[#111827] truncate">
            Tập luyện tháng này
          </h2>
        </div>

        {/* Month Switcher */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onPrevMonth}
            className="p-1 text-[#374151] hover:text-[#0095FF] transition cursor-pointer"
            aria-label="Tháng trước"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
          </button>
          <span className="text-[14px] font-semibold text-[#111827] min-w-[58px] text-center tabular-nums">
            {formatMonthYear(month, year)}
          </span>
          <button
            type="button"
            onClick={onNextMonth}
            className="p-1 text-[#374151] hover:text-[#0095FF] transition cursor-pointer"
            aria-label="Tháng sau"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Summary Stat Boxes */}
      <div className="grid grid-cols-2 gap-3 mt-3.5">
        <div className="bg-[#E8F4FF] rounded-[14px] py-3 px-3 flex flex-col items-center justify-center text-center">
          <span className="text-[13px] font-medium text-[#1F2937]">
            Không tập luyện
          </span>
          <span className="text-[24px] leading-tight font-bold text-[#111827] mt-0.5 tabular-nums">
            {untrainedCount}
          </span>
        </div>

        <div className="bg-[#0095FF] rounded-[14px] py-3 px-3 flex flex-col items-center justify-center text-center">
          <span className="text-[13px] font-medium text-white">
            Đã tập luyện
          </span>
          <span className="text-[24px] leading-tight font-bold text-white mt-0.5 tabular-nums">
            {trainedCount}
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mt-4">
        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {WEEKDAY_LABELS.map((dayLabel) => (
            <div
              key={dayLabel}
              className="text-[13px] font-semibold text-[#374151] py-0.5"
            >
              {dayLabel}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {cells.map((cell) => {
            let cellStyle = '';
            if (!cell.isCurrentMonth) {
              cellStyle = 'bg-[#ECEEF2] text-[#9CA3AF] font-medium';
            } else if (cell.isTrained) {
              cellStyle = 'bg-[#0095FF] text-white font-bold';
            } else if (cell.isToday) {
              cellStyle =
                'bg-[#E8F4FF] text-[#111827] font-semibold border-[1.75px] border-[#0095FF]';
            } else {
              cellStyle = 'bg-[#E8F4FF] text-[#1F2937] font-medium';
            }

            return (
              <div
                key={cell.dateStr}
                className={`aspect-square rounded-[10px] flex items-center justify-center text-[14px] select-none tabular-nums ${cellStyle}`}
              >
                {cell.day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
