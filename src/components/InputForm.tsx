import React, { useMemo, useState } from 'react';
import {
  Bell,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  CUSTOM_LOCATION_VALUE,
  WAYS_STATION_LOCATIONS,
} from '../constants/locations';
import { CheckInEntry, GeneratorConfig } from '../types/checkin';
import {
  WEEKDAY_LABELS,
  calculateMonthlyStats,
  formatDisplayDate,
  formatMonthYear,
  getDaysInMonth,
  pad2,
  sortCheckInEntriesAsc,
  toDateStr,
} from '../utils/calendar';

interface InputFormProps {
  config: GeneratorConfig;
  onChange: (next: GeneratorConfig) => void;
  onGenerate: () => void;
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const InputForm: React.FC<InputFormProps> = ({
  config,
  onChange,
  onGenerate,
}) => {
  const isPresetLocation = WAYS_STATION_LOCATIONS.includes(config.defaultLocation);
  const [locationMode, setLocationMode] = useState<string>(
    isPresetLocation ? config.defaultLocation : CUSTOM_LOCATION_VALUE
  );
  const [defaultTime, setDefaultTime] = useState<string>('17:30');

  const { month, year, entries, defaultLocation, notificationCount } = config;
  const monthPrefix = `${year}-${pad2(month)}-`;

  const monthEntries = useMemo(
    () => sortCheckInEntriesAsc(entries.filter((e) => e.date.startsWith(monthPrefix))),
    [entries, monthPrefix]
  );

  const statsPreview = useMemo(
    () => calculateMonthlyStats(year, month, entries),
    [year, month, entries]
  );

  const handlePrevMonth = () => {
    const nextMonth = month === 1 ? 12 : month - 1;
    const nextYear = month === 1 ? year - 1 : year;
    onChange({ ...config, month: nextMonth, year: nextYear });
  };

  const handleNextMonth = () => {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    onChange({ ...config, month: nextMonth, year: nextYear });
  };

  const handleMonthInputChange = (value: string) => {
    if (!value) return;
    const [yStr, mStr] = value.split('-');
    const y = Number(yStr);
    const m = Number(mStr);
    if (y >= 2000 && y <= 2100 && m >= 1 && m <= 12) {
      onChange({ ...config, year: y, month: m });
    }
  };

  const handleLocationSelectChange = (val: string) => {
    setLocationMode(val);
    if (val !== CUSTOM_LOCATION_VALUE) {
      onChange({ ...config, defaultLocation: val });
    }
  };

  const handleApplyLocationToMonth = () => {
    if (!defaultLocation.trim()) return;
    const updated = entries.map((entry) =>
      entry.date.startsWith(monthPrefix)
        ? { ...entry, location: defaultLocation }
        : entry
    );
    onChange({ ...config, entries: updated });
  };

  const handleToggleDay = (day: number) => {
    const targetDate = toDateStr(year, month, day);
    const hasExisting = entries.some((e) => e.date === targetDate);
    if (hasExisting) {
      onChange({
        ...config,
        entries: entries.filter((e) => e.date !== targetDate),
      });
    } else {
      // Add slight natural minute offset if defaultTime ends with :00 or :30, or use exact defaultTime
      const newEntry: CheckInEntry = {
        id: createId(),
        date: targetDate,
        time: defaultTime || '17:30',
        location: defaultLocation || WAYS_STATION_LOCATIONS[0],
      };
      onChange({
        ...config,
        entries: [...entries, newEntry],
      });
    }
  };

  const handleAddManualRow = () => {
    const daysInMonth = getDaysInMonth(year, month);
    // Pick the first unchecked day in the month, or day 1
    const usedDays = new Set(
      monthEntries.map((e) => Number(e.date.split('-')[2]))
    );
    let chosenDay = 1;
    for (let d = 1; d <= daysInMonth; d++) {
      if (!usedDays.has(d)) {
        chosenDay = d;
        break;
      }
    }
    const newEntry: CheckInEntry = {
      id: createId(),
      date: toDateStr(year, month, chosenDay),
      time: defaultTime || '17:30',
      location: defaultLocation || WAYS_STATION_LOCATIONS[0],
    };
    onChange({
      ...config,
      entries: [...entries, newEntry],
    });
  };

  const handleUpdateEntry = (id: string, patch: Partial<CheckInEntry>) => {
    onChange({
      ...config,
      entries: entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  };

  const handleRemoveEntry = (id: string) => {
    onChange({
      ...config,
      entries: entries.filter((e) => e.id !== id),
    });
  };

  const handleClearMonth = () => {
    onChange({
      ...config,
      entries: entries.filter((e) => !e.date.startsWith(monthPrefix)),
    });
  };

  const minDateInMonth = toDateStr(year, month, 1);
  const maxDateInMonth = toDateStr(year, month, getDaysInMonth(year, month));

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-6 px-4">
      <div className="max-w-xl mx-auto space-y-5">
        {/* Header Card */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Ways Station Check-in Generator
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Select month, pick your check-in dates &amp; times, then click{' '}
                <span className="font-semibold text-[#0095FF]">Generate</span>.
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#EBF5FF] text-[#0095FF] flex items-center justify-center shrink-0">
              <CalendarIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Month & Branch Configuration */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Month Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                Target Month
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <input
                  type="month"
                  value={`${year}-${pad2(month)}`}
                  onChange={(e) => handleMonthInputChange(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                />
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Default Time for Newly Clicked Days */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                Default Check-in Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={defaultTime}
                  onChange={(e) => setDefaultTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                />
              </div>
            </div>
          </div>

          {/* Notification Badge Count */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
              Notification Badge Count (Thông báo)
            </label>
            <div className="flex items-center gap-3">
              <div className="relative w-36">
                <Bell className="w-4 h-4 text-[#0095FF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  min={0}
                  max={999}
                  value={notificationCount}
                  onChange={(e) => {
                    const parsed = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                    onChange({
                      ...config,
                      notificationCount: Number.isNaN(parsed) ? 0 : Math.max(0, parsed),
                    });
                  }}
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                />
              </div>
              <span className="text-xs text-slate-500">
                Set to <code className="font-semibold text-slate-700">0</code> to hide the red badge
              </span>
            </div>
          </div>

          {/* Branch Location */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ways Station Branch
              </label>
              {monthEntries.length > 0 && (
                <button
                  type="button"
                  onClick={handleApplyLocationToMonth}
                  className="text-xs font-medium text-[#0095FF] hover:underline cursor-pointer"
                >
                  Apply to all ({monthEntries.length}) in {formatMonthYear(month, year)}
                </button>
              )}
            </div>
            <select
              value={locationMode}
              onChange={(e) => handleLocationSelectChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
            >
              {WAYS_STATION_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
              <option value={CUSTOM_LOCATION_VALUE}>
                Custom branch address...
              </option>
            </select>

            {locationMode === CUSTOM_LOCATION_VALUE && (
              <input
                type="text"
                value={defaultLocation}
                onChange={(e) =>
                  onChange({ ...config, defaultLocation: e.target.value })
                }
                placeholder="Enter Ways Station branch name and address..."
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
              />
            )}
          </div>
        </div>

        {/* Interactive Calendar Day Tapper */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Tap Days to Check In ({formatMonthYear(month, year)})
              </h2>
              <p className="text-xs text-slate-500">
                Không tập luyện:{' '}
                <span className="font-semibold text-slate-700">
                  {statsPreview.untrainedCount}
                </span>{' '}
                &middot; Đã tập luyện:{' '}
                <span className="font-semibold text-[#0095FF]">
                  {statsPreview.trainedCount}
                </span>
              </p>
            </div>
            {monthEntries.length > 0 && (
              <button
                type="button"
                onClick={handleClearMonth}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                Clear month
              </button>
            )}
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center mb-1.5">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="text-xs font-semibold text-slate-500 py-1"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {statsPreview.cells.map((cell) => {
              if (!cell.isCurrentMonth) {
                return (
                  <div
                    key={cell.dateStr}
                    className="aspect-square rounded-xl bg-[#EAECF0] text-slate-400 text-sm font-medium flex items-center justify-center select-none opacity-70"
                  >
                    {cell.day}
                  </div>
                );
              }
              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  onClick={() => handleToggleDay(cell.day)}
                  className={`aspect-square rounded-xl text-sm font-semibold flex items-center justify-center transition cursor-pointer ${
                    cell.isTrained
                      ? 'bg-[#0095FF] text-white shadow-xs'
                      : 'bg-[#EBF5FF] text-slate-700 hover:bg-[#d8ecff]'
                  } ${
                    cell.isToday && !cell.isTrained
                      ? 'ring-2 ring-inset ring-[#0095FF] text-[#0095FF]'
                      : ''
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Editable Check-in Date & Time Rows */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Check-in Logs ({monthEntries.length})
            </h2>
            <button
              type="button"
              onClick={handleAddManualRow}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0095FF] bg-[#EBF5FF] hover:bg-[#dbeeff] px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Check-in
            </button>
          </div>

          {monthEntries.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl text-sm text-slate-400">
              No check-in dates selected for {formatMonthYear(month, year)}. Tap
              dates on the calendar above or click &ldquo;Add Check-in&rdquo;.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {monthEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <CalendarIcon className="w-4 h-4 text-[#0095FF] shrink-0" />
                      <input
                        type="date"
                        min={minDateInMonth}
                        max={maxDateInMonth}
                        value={entry.date}
                        onChange={(e) =>
                          handleUpdateEntry(entry.id, { date: e.target.value })
                        }
                        aria-label={`Date for ${formatDisplayDate(entry.date)}`}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 w-32 sm:w-36 shrink-0">
                      <Clock className="w-4 h-4 text-[#0095FF] shrink-0" />
                      <input
                        type="time"
                        value={entry.time}
                        onChange={(e) =>
                          handleUpdateEntry(entry.id, { time: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveEntry(entry.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                      aria-label="Remove check-in"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#0095FF] shrink-0" />
                    <input
                      type="text"
                      list="ways-station-presets"
                      value={entry.location}
                      onChange={(e) =>
                        handleUpdateEntry(entry.id, {
                          location: e.target.value,
                        })
                      }
                      placeholder="Ways Station branch address"
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <datalist id="ways-station-presets">
            {WAYS_STATION_LOCATIONS.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
        </div>

        {/* Generate CTA */}
        <button
          type="button"
          onClick={onGenerate}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#0095FF] hover:bg-[#0084e6] active:scale-[0.99] text-white font-bold text-base shadow-md shadow-[#0095FF]/25 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Sparkles className="w-5 h-5" />
          Generate
        </button>
      </div>
    </div>
  );
};
