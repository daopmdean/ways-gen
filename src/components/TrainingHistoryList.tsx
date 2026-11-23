import React from 'react';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { CheckInEntry } from '../types/checkin';
import { formatDisplayDate } from '../utils/calendar';

interface TrainingHistoryListProps {
  logs: CheckInEntry[];
}

export const TrainingHistoryList: React.FC<TrainingHistoryListProps> = ({
  logs,
}) => {
  return (
    <section className="mt-[18px]">
      <h2 className="text-[16px] font-bold text-[#0D0D0D] mb-2 pl-[9px]">
        Lịch sử tập luyện
      </h2>

      {logs.length === 0 ? (
        <div className="bg-white rounded-[16px] px-3 py-8 text-center text-[14px] text-[#9CA3AF] shadow-[0_2px_8px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.06)]">
          Chưa có lịch sử tập luyện trong tháng này
        </div>
      ) : (
        <div className="space-y-[10px]">
          {logs.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-[16px] px-3 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.06)] space-y-[5px]"
            >
              {/* Date Line */}
              <div className="flex items-center gap-2">
                <CalendarDays className="w-[15px] h-[15px] text-[#0999ED] stroke-[2] shrink-0" />
                <span className="text-[14px] leading-[1.3] font-normal text-[#0D0D0D] tabular-nums">
                  {formatDisplayDate(entry.date)}
                </span>
              </div>

              {/* Time Line */}
              <div className="flex items-center gap-2">
                <Clock className="w-[15px] h-[15px] text-[#0999ED] stroke-[2] shrink-0" />
                <span className="text-[14px] leading-[1.3] font-normal text-[#0D0D0D] tabular-nums">
                  {entry.time}
                </span>
              </div>

              {/* Location Line */}
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-[15px] h-[15px] text-[#0999ED] stroke-[2] shrink-0" />
                <span className="text-[14px] leading-[1.3] font-normal text-[#0D0D0D] truncate">
                  {entry.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
