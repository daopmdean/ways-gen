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
  const now = new Date();
  const isAtOrAfterCurrentMonth =
    year > now.getFullYear() ||
    (year === now.getFullYear() && month >= now.getMonth() + 1);

  const firstCurrentMonthIdx = cells.findIndex((c) => c.isCurrentMonth);

  return (
    <div className="bg-white rounded-[16px] px-3 pt-4 pb-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.06)]">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Blue L-Axis Ascending Bar Chart Icon */}
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#0999ED] shrink-0"
            aria-hidden="true"
          >
            <path
              d="M3 3.5V20.5H20.5"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="6"
              y="11.5"
              width="3.2"
              height="6"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <rect
              x="11.4"
              y="8.5"
              width="3.2"
              height="9"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <rect
              x="16.8"
              y="5.5"
              width="3.2"
              height="12"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.7"
            />
          </svg>
          <h2 className="text-[16px] font-bold text-[#0D0D0D] truncate">
            Tập luyện tháng này
          </h2>
        </div>

        {/* Month Switcher */}
        <div className="flex items-center gap-2 shrink-0 pr-1">
          <button
            type="button"
            onClick={onPrevMonth}
            className="p-0.5 text-[#0999ED] hover:opacity-80 transition cursor-pointer"
            aria-label="Tháng trước"
          >
            <ChevronLeft className="w-[16px] h-[16px] stroke-[2.2]" />
          </button>
          <span className="text-[14px] font-normal text-[#252525] min-w-[58px] text-center tabular-nums">
            {formatMonthYear(month, year)}
          </span>
          <button
            type="button"
            onClick={onNextMonth}
            className={`p-0.5 transition cursor-pointer ${
              isAtOrAfterCurrentMonth
                ? 'text-[#C8C8C8] hover:text-[#9CA3AF]'
                : 'text-[#0999ED] hover:opacity-80'
            }`}
            aria-label="Tháng sau"
          >
            <ChevronRight className="w-[16px] h-[16px] stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Summary Stat Boxes */}
      <div className="grid grid-cols-2 gap-[10px] mt-3.5">
        <div className="bg-[#CDEAFB] rounded-[12px] px-[13px] pt-[10px] pb-[11px] min-h-[63px] flex flex-col items-start justify-between text-left">
          <span className="text-[12px] font-normal text-[#0D0D0D] leading-[1.25]">
            Không tập luyện
          </span>
          <span className="text-[22px] leading-none font-bold text-[#0D0D0D] mt-1 tabular-nums">
            {untrainedCount}
          </span>
        </div>

        <div className="bg-[#0999ED] rounded-[12px] px-[13px] pt-[10px] pb-[11px] min-h-[63px] flex flex-col items-start justify-between text-left">
          <span className="text-[12px] font-normal text-[#0D0D0D] leading-[1.25]">
            Đã tập luyện
          </span>
          <span className="text-[22px] leading-none font-bold text-[#0D0D0D] mt-1 tabular-nums">
            {trainedCount}
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mt-3">
        <div className="grid grid-cols-7 gap-[2px] text-center mb-2">
          {WEEKDAY_LABELS.map((dayLabel) => (
            <div
              key={dayLabel}
              className="text-[12px] font-normal text-[#3D3D3D] leading-none py-0.5"
            >
              {dayLabel}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-[2px]">
          {cells.map((cell, idx) => {
            const isTrailingNextMonth =
              !cell.isCurrentMonth &&
              firstCurrentMonthIdx !== -1 &&
              idx > firstCurrentMonthIdx;

            if (isTrailingNextMonth) {
              return (
                <div
                  key={cell.dateStr}
                  className="h-[40px]"
                  aria-hidden="true"
                />
              );
            }

            let cellStyle = '';
            if (!cell.isCurrentMonth) {
              cellStyle = 'bg-[#EBEBEB] text-[#B1B1B1]';
            } else if (cell.isTrained) {
              cellStyle = 'bg-[#0999ED] text-[#0D0D0D]';
            } else if (cell.isToday) {
              cellStyle =
                'bg-[#CDEAFB] text-[#0D0D0D] border-[2px] border-[#0999ED]';
            } else {
              cellStyle = 'bg-[#CDEAFB] text-[#0D0D0D]';
            }

            return (
              <div
                key={cell.dateStr}
                className={`h-[40px] rounded-[5px] pt-[4.5px] pl-[4.5px] flex items-start justify-start text-[11px] leading-none font-normal select-none tabular-nums ${cellStyle}`}
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
