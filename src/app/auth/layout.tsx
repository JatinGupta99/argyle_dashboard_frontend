'use client';

import React, { ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
<div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-6">
  <div className="mb-4">
    <Image
      src="/images/argyle-logo.png"
      alt="Argyle Logo"
      width={220}
      height={220}
      className="object-contain"
    />
  </div>
  <div className="w-full max-w-sm">
    {children}
  </div>
</div>

  );
}
