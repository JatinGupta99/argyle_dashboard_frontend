'use client';

import { Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Header() {
  return (
    <>
      {/* Header Section */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-yellow-500 px-6 py-3">
        {/* Left - Welcome Text */}
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Welcome Back Jhon!</h2>
          <p className="text-xs text-gray-500">This is your schedule today</p>
        </div>

        {/* Right - Search, Actions, Profile */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input placeholder="Search" className="w-56 border-gray-300 pl-8 text-sm" />
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-sm font-medium text-gray-700"
          >
            <Filter className="mr-1 h-4 w-4" />
            Filter
          </Button>

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-sm font-medium text-gray-700"
          >
            <Download className="mr-1 h-4 w-4" />
            Export
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-3">
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
        </div>
      </header>

      {/* Spacer so content doesn’t hide behind header */}
      <div className="h-[64px]" />
    </>
  );
}
