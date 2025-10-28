'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell, Search } from 'lucide-react';
import Image from 'next/image';

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-3">
      <div>
        <h2 className="text-lg font-semibold">Welcome Back Jhon!</h2>
        <p className="text-muted-foreground text-sm">This is your schedule today</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-94">
          <Input placeholder="Search" className="pr-8" />
          <Search className="text-muted-foreground absolute top-2.5 right-2 h-4 w-4" />
        </div>

        <div className="flex items-center gap-3 border-gray-200 pl-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gray-100">
            <Image
              src="/images/avatar.png"
              alt="User"
              width={36}
              height={36}
              className="object-cover"
            />
          </div>
          <div className="text-sm leading-tight">
            <p className="font-semibold text-gray-800">Dhon Jon</p>
            <p className="text-xs text-gray-500">Staff</p>
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
