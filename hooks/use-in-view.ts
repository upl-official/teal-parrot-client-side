"use client"

import { useState, useEffect, useRef } from "react"

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useInView({ threshold = 0.1, rootMargin = "0px", triggerOnce = true }: UseInViewOptions = {}) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement | null>(null)
  const enteredView = useRef(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Clean up previous observer if it exists
    if (observerRef.current && ref.current) {
      observerRef.current.unobserve(ref.current)
      observerRef.current.disconnect()
    }

    // Create a new observer with a more efficient callback
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting && !enteredView.current) {
          // Use requestAnimationFrame to batch state updates
          requestAnimationFrame(() => {
            setIsInView(true)
            if (triggerOnce) {
              enteredView.current = true
            }
          })
        } else if (!triggerOnce) {
          // Use requestAnimationFrame to batch state updates
          requestAnimationFrame(() => {
            setIsInView(entry?.isIntersecting || false)
          })
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    const currentRef = ref.current
    if (currentRef) {
      observerRef.current.observe(currentRef)
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef)
        observerRef.current.disconnect()
      }
    }
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isInView }
}
