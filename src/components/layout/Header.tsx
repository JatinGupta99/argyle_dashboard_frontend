'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  if (loading) return null;
  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-gray-100 bg-white px-6 py-3">
      <div>
        <h2 className="text-sm font-semibold text-gray-800">
          Welcome Back, {user.name ? user.name.split(' ')[0] : user.email}!
        </h2>
        <p className="text-xs text-gray-500">Here’s your schedule today</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative mr-50">
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
            src={user.avatar??'/images/avatar.png'}
            alt={user.name}
            fill
            className="rounded-md object-cover"
            sizes="36px"
          />
        </button>

        <div className="mr-3 text-sm leading-tight">
          <p className="font-semibold text-gray-800">{user.name || user.email}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
      </div>
    </header>
  );
}
