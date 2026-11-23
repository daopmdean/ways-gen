import { useState } from 'react';
import { GeneratedScreen } from './components/GeneratedScreen';
import { InputForm } from './components/InputForm';
import { WAYS_STATION_LOCATIONS } from './constants/locations';
import { CheckInEntry, GeneratorConfig } from './types/checkin';
import { pad2 } from './utils/calendar';

function buildInitialConfig(): GeneratorConfig {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const defaultLocation = WAYS_STATION_LOCATIONS[0];

  const sampleDaysAndTimes: Array<{ day: number; time: string; locIdx: number }> = [
    { day: 2, time: '18:05', locIdx: 0 },
    { day: 5, time: '17:42', locIdx: 0 },
    { day: 6, time: '18:15', locIdx: 1 },
    { day: 11, time: '17:50', locIdx: 0 },
    { day: 13, time: '18:28', locIdx: 0 },
    { day: 15, time: '16:45', locIdx: 1 },
    { day: 19, time: '17:36', locIdx: 0 },
    { day: 20, time: '18:12', locIdx: 0 },
    { day: 22, time: '17:23', locIdx: 0 },
  ];

  const maxValidDay = new Date(year, month, 0).getDate();
  const entries: CheckInEntry[] = sampleDaysAndTimes
    .filter((item) => item.day <= maxValidDay)
    .map((item, idx) => ({
      id: `init-${idx}`,
      date: `${year}-${pad2(month)}-${pad2(item.day)}`,
      time: item.time,
      location: WAYS_STATION_LOCATIONS[item.locIdx] ?? defaultLocation,
    }));

  return {
    month,
    year,
    defaultLocation,
    notificationCount: 7,
    entries,
  };
}

export default function App() {
  const [config, setConfig] = useState<GeneratorConfig>(buildInitialConfig);
  const [view, setView] = useState<'form' | 'generated'>('form');

  if (view === 'generated') {
    return (
      <GeneratedScreen
        config={config}
        onBack={() => setView('form')}
      />
    );
  }

  return (
    <InputForm
      config={config}
      onChange={setConfig}
      onGenerate={() => setView('generated')}
    />
  );
}
