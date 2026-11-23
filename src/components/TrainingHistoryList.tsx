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
    <section className="mt-5">
      <h2 className="text-[16px] font-bold text-[#111827] mb-3">
        Lịch sử tập luyện
      </h2>

      {logs.length === 0 ? (
        <div className="bg-white rounded-[18px] px-4 py-8 text-center text-[14px] text-[#9CA3AF] shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
          Chưa có lịch sử tập luyện trong tháng này
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-[18px] px-4 py-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.03)] space-y-2"
            >
              {/* Date Line */}
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-[17px] h-[17px] text-[#0095FF] stroke-[2] shrink-0" />
                <span className="text-[14px] font-medium text-[#1F2937] tabular-nums">
                  {formatDisplayDate(entry.date)}
                </span>
              </div>

              {/* Time Line */}
              <div className="flex items-center gap-2.5">
                <Clock className="w-[17px] h-[17px] text-[#0095FF] stroke-[2] shrink-0" />
                <span className="text-[14px] font-medium text-[#1F2937] tabular-nums">
                  {entry.time}
                </span>
              </div>

              {/* Location Line */}
              <div className="flex items-center gap-2.5 min-w-0">
                <MapPin className="w-[17px] h-[17px] text-[#0095FF] stroke-[2] shrink-0" />
                <span className="text-[14px] font-normal text-[#374151] truncate">
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
