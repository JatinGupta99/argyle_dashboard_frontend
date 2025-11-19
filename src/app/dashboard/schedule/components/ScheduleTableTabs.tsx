'use client';

interface Props {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export default function ScheduleTableTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="flex items-center gap-3 border-b pb-3">
      {['ALL', 'PENDING', 'UPCOMING', 'PAST'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            activeTab === tab
              ? 'bg-sky-500 text-white shadow'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
}
