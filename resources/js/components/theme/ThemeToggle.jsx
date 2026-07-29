import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // `resolvedTheme` is only known once next-themes has read the DOM/storage,
  // so hold the icon back until then to avoid flashing the wrong one.
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {mounted && (isDark ? <Sun size={20} /> : <Moon size={20} />)}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
