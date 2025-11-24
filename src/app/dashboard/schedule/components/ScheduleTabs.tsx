'use client';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = ['ALL', 'UPCOMING', 'PAST'];

export default function ScheduleTableTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="flex space-x-4 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`-mb-px rounded-t px-4 py-2 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'} `}
        >
          {tab.charAt(0) + tab.slice(1).toLowerCase()}
        </button>
      ))}
    </div>
  );
}
