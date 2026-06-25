"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react'
import { Bell, Sun, Moon, Menu, LogOut, User, Settings } from 'lucide-react'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import timeAgo from '@/utils/timeAgo'
import { useTheme } from '@/hooks/useTheme'
import Avatar from '@/components/common/Avatar'

const Navbar = ({ onMenuToggle }: any) => {
  const { user, logout, primaryRole }: any = {}
  const { theme, toggleTheme } = useTheme()
  const location = {}
  const navigate = useRouter()
  const [showUser, setShowUser]   = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [notifs, setNotifs]       = useState([])
  const userRef  = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const unread = notifs.filter((n: any) => !n.read).length


  useEffect(() => {
    const handler = (e: any) => {
      if (userRef?.current && !userRef?.current?.contains(e.target))  setShowUser(false)
      if (notifRef?.current && !notifRef?.current?.contains(e.target)) setShowNotif(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const markRead = async (id: string) => {
    
  }

  const handleLogout = () => { logout(); navigate.push('/login') }

  return (
    <header className="sticky top-0 z-40 flex items-center h-14 px-4 lg:px-6 border-b shrink-0" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
      {/* Mobile menu button */}
      <button onClick={onMenuToggle} className="lg:hidden mr-3 p-1.5 rounded-lg hover:bg-[--bg-surface-2]" style={{ color: 'var(--secondary)' }}>
        <Menu size={18} />
      </button>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs flex-1 min-w-0">
        
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-1 ml-3">
        {/* Theme */}
        <button onClick={toggleTheme} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[--bg-surface-2] hover:cursor-pointer transition-colors">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotif(v => !v)} className="w-8 h-8 rounded-lg hover:cursor-pointer flex items-center justify-center hover:bg-[--bg-surface-2] transition-colors relative">
            <Bell size={15} />
            {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-full mt-1 w-80 rounded-xl border shadow-lg surface animate-slide-up z-50">
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm font-700" style={{ color: 'var(--primary)' }}>Notifications</span>
                {unread > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-600">{unread} new</span>}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y" style={{ borderColor: 'var(--border)' }}>
                {notifs.map((n: any) => (
                  <div key={n.id} className={clsx('px-4 py-3 cursor-pointer hover:bg-[--bg-surface-2] transition-colors', !n.read && 'bg-blue-50/50 dark:bg-blue-900/10')} onClick={() => markRead(n.id)}>
                    <div className="flex items-start gap-2">
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
                      <div className={!n.read ? '' : 'ml-3.5'}>
                        <p className="text-xs font-600" style={{ color: 'var(--primary)' }}>{n.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--secondary)' }}>{n.body}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{timeAgo(n.time)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative ml-1" ref={userRef}>
          <button onClick={() => setShowUser(v => !v)} className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg hover:bg-[--bg-surface-2] transition-colors">
            <Avatar name={"user?.fullName"} size="xs" />
            <span className="text-xs font-600 hidden sm:block" style={{ color: 'var(--primary)' }}>{"Knr naeem"?.split(' ')[0]}</span>
          </button>
          {showUser && (
            <div className="absolute right-0 top-full mt-1 w-52 rounded-xl border shadow-lg surface animate-slide-up z-50">
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm font-700" style={{ color: 'var(--primary)' }}>Knr Naeem</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>naeem@email.com</p>
              </div>
              <div className="p-1.5 space-y-0.5">
                <button onClick={() => { navigate.push('/profile'); setShowUser(false) }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-500 hover:bg-[--bg-surface-2] transition-colors">
                  <User size={13} />Profile & Settings
                </button>
                <button onClick={() => { navigate.push('/settings'); setShowUser(false) }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-500 hover:bg-[--bg-surface-2] transition-colors">
                  <Settings size={13} />Preferences
                </button>
                <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                  <LogOut size={13} />Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
