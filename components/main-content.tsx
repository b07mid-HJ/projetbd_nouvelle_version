"use client"

import { ReactNode } from 'react'
import { useSidebar } from '@/context/sidebar-context'
import { cn } from '@/lib/utils'

interface MainContentProps {
  children: ReactNode
}

export function MainContent({ children }: MainContentProps) {
  const { isOpen } = useSidebar()

  return (
    <div 
      className={cn(
        "transition-all duration-300",
        isOpen ? "md:ml-64" : "md:ml-16"
      )}
    >
      {children}
    </div>
  )
}