'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export function Header() {
  const [user] = useState({
    name: 'John Doe',
    role: 'Staff',
    avatar: '/images/avatar.png',
  });

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-gray-100 bg-white px-6 py-3">
      {/* Left side */}
      <div>
        <h2 className="text-sm font-semibold text-gray-800">
          Welcome Back, {user.name.split(' ')[0]}!
        </h2>
        <p className="text-xs text-gray-500">Here’s your schedule today</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="relative mr-50">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-80 border-gray-300 pr-8 text-sm"
          />
          <Search className="absolute top-2.5 right-2.5 h-4 w-4 cursor-pointer text-gray-400" />
        </div>

        {/* Avatar */}
        <button
          type="button"
          className="relative flex h-9 w-9  items-center justify-center rounded-md border border-gray-200 bg-gray-50 transition hover:bg-gray-100 overflow-hidden"
        >
          <Image src={user.avatar} alt={user.name} fill className="object-cover" sizes="36px" />
        </button>

        {/* User info */}
        <div className="text-sm leading-tight mr-2">
          <p className="font-semibold text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
      </div>
    </header>
  );
}
