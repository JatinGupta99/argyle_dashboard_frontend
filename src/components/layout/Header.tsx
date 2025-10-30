'use client';

import { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export function Header() {
  const [user] = useState({
    name: 'John Doe',
    role: 'Staff',
    avatar: '/images/avatar.png',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleNotificationClick = () => {
    setNotifications(0);
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-gray-100 bg-white px-6 py-3">
      <div>
        <h2 className="text-sm font-semibold text-gray-800">
          Welcome Back, {user.name.split(' ')[0]}!
        </h2>
        <p className="text-xs text-gray-500">Here’s your schedule today</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative mr-6">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-100 border-gray-300 pr-8 text-sm"
          />
          <Search className="absolute top-2.5 right-2.5 h-4 w-4 cursor-pointer text-gray-400" />
        </div>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-gray-50 transition hover:bg-gray-100"
        >
          <Image
            src={user.avatar}
            alt={user.name}
            fill
            className="rounded-md object-cover"
            sizes="36px"
          />
        </button>
        <div className="text-sm leading-tight">
          <p className="font-semibold text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
        <button
          type="button"
          onClick={handleNotificationClick}
          className="relative flex h-9 w-9 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
        >
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-sky-500 text-[10px] font-semibold text-white">
              {notifications}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
