import { useState, useCallback, useRef, useEffect } from 'react'

interface UseTabsOptions {
  defaultTab?: string
  fadeInDuration?: number
  fadeOutDuration?: number
}

export function useTabs<T extends string>(tabs: T[], options: UseTabsOptions = {}) {
  const { defaultTab } = options
  const [activeTab, setActiveTab] = useState<T>(defaultTab as T || tabs[0])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const selectTab = useCallback((tab: T) => {
    if (tab === activeTab || isTransitioning) return

    setIsTransitioning(true)

    timeoutRef.current = setTimeout(() => {
      setActiveTab(tab)
      setIsTransitioning(false)
    }, 100)
  }, [activeTab, isTransitioning])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentIndex = tabs.indexOf(activeTab)
    let newIndex = currentIndex

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        newIndex = currentIndex - 1
        if (newIndex < 0) newIndex = tabs.length - 1
        break
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        newIndex = currentIndex + 1
        if (newIndex >= tabs.length) newIndex = 0
        break
      case 'Home':
        e.preventDefault()
        newIndex = 0
        break
      case 'End':
        e.preventDefault()
        newIndex = tabs.length - 1
        break
      default:
        return
    }

    selectTab(tabs[newIndex])
  }, [activeTab, tabs, selectTab])

  const getTabStyle = useCallback((tab: T): React.CSSProperties => {
    const isActive = tab === activeTab
    
    if (!isActive) {
      return {
        display: 'none',
      }
    }
    
    return {
      display: 'block',
      opacity: 1,
      pointerEvents: 'auto',
    }
  }, [activeTab])

  return {
    activeTab,
    selectTab,
    isTransitioning,
    handleKeyDown,
    isActive: (tab: T) => tab === activeTab,
    getTabStyle,
  }
}
