'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center gap-2 p-1 border border-primary/20 rounded-full bg-background/50 backdrop-blur-sm">
      <button
        onClick={() => setTheme('light')}
        className={cn(
          "p-2 rounded-full transition-all hover:bg-secondary/50",
          theme === 'light' ? "bg-secondary text-primary shadow-sm" : "text-gray-400"
        )}
        aria-label="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          "p-2 rounded-full transition-all hover:bg-secondary/50",
          theme === 'dark' ? "bg-secondary text-primary shadow-sm" : "text-gray-400"
        )}
        aria-label="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('reading')}
        className={cn(
          "p-2 rounded-full transition-all hover:bg-secondary/50",
          theme === 'reading' ? "bg-secondary text-primary shadow-sm" : "text-gray-400"
        )}
        aria-label="Reading Mode"
      >
        <BookOpen className="w-4 h-4" />
      </button>
    </div>
  )
}
