/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx } from 'clsx'
import Image from "next/image"

const colors = ['bg-blue-500','bg-purple-500','bg-emerald-500','bg-amber-500','bg-rose-500','bg-cyan-500','bg-indigo-500']

const getColor = (name = '') => colors[name.charCodeAt(0) % colors.length]

const getInitials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-sm', xl: 'w-16 h-16 text-lg' }

type AvatarSize = keyof typeof sizes

const Avatar = ({ name, src, size = 'md', className }: { name: string; src?: string; size?: AvatarSize; className?: string }) => {
  if (src) return <Image src={src} alt={name} className={clsx('rounded-full object-cover', sizes[size], className)} />
  return (
    <div className={clsx('rounded-full flex items-center justify-center text-white font-700 shrink-0', sizes[size], getColor(name), className)}>
      {getInitials(name)}
    </div>
  )
}

export default Avatar
