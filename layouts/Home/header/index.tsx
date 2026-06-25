/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Bell, Sun, Moon, Menu, LogOut, User, Settings } from 'lucide-react'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import timeAgo from '@/utils/timeAgo'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 flex items-center h-14 px-4 lg:px-6 border-b flex-shrink-0" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
      
    </header>
  )
}

export default Navbar
