import React, { useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { GeneratorConfig } from '../types/checkin';
import { calculateMonthlyStats } from '../utils/calendar';
import { BottomNavBar } from './BottomNavBar';
import { MonthlySummaryCard } from './MonthlySummaryCard';
import { TrainingHistoryList } from './TrainingHistoryList';

interface GeneratedScreenProps {
  config: GeneratorConfig;
  onBack: () => void;
}

export const GeneratedScreen: React.FC<GeneratedScreenProps> = ({
  config,
  onBack,
}) => {
  const [viewMonth, setViewMonth] = useState<number>(config.month);
  const [viewYear, setViewYear] = useState<number>(config.year);

  const stats = useMemo(
    () => calculateMonthlyStats(viewYear, viewMonth, config.entries),
    [viewYear, viewMonth, config.entries]
  );

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E7EB] sm:py-0 flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-[#F2F4F7] relative flex flex-col">
        {/* Top App Bar */}
        <header className="sticky top-0 z-10 bg-[#F2F4F7]/95 backdrop-blur-xs px-4 pt-3 pb-2.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            title="Back to generator settings"
            className="w-8 h-8 -ml-1.5 rounded-full flex items-center justify-center text-[#111827] hover:bg-black/5 active:bg-black/10 transition cursor-pointer"
            aria-label="Quay lại"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
          </button>

          <h1 className="text-[17px] font-bold text-[#111827] tracking-[-0.01em]">
            Tập luyện
          </h1>

          {/* Right spacer to keep title centered */}
          <div className="w-8 h-8 -mr-1.5" aria-hidden="true" />
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 px-4 pt-1 pb-28">
          <MonthlySummaryCard
            month={viewMonth}
            year={viewYear}
            untrainedCount={stats.untrainedCount}
            trainedCount={stats.trainedCount}
            cells={stats.cells}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          <TrainingHistoryList logs={stats.monthLogs} />
        </main>

        {/* Floating Bottom Navigation */}
        <BottomNavBar notificationCount={config.notificationCount} />
      </div>
    </div>
  );
};
