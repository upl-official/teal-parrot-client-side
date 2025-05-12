"use client"

import { useState, useEffect } from "react"

export function LayoutDebugger() {
  const [isVisible, setIsVisible] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [documentWidth, setDocumentWidth] = useState(0)
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== "development") return

    const updateMeasurements = () => {
      setViewportWidth(window.innerWidth)
      setDocumentWidth(document.documentElement.offsetWidth)
      setScrollbarWidth(window.innerWidth - document.documentElement.clientWidth)
    }

    updateMeasurements()
    window.addEventListener("resize", updateMeasurements)

    return () => {
      window.removeEventListener("resize", updateMeasurements)
    }
  }, [])

  if (process.env.NODE_ENV !== "development") return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button onClick={() => setIsVisible(!isVisible)} className="bg-black text-white px-3 py-1 rounded-md text-xs">
        {isVisible ? "Hide Layout Debug" : "Debug Layout"}
      </button>

      {isVisible && (
        <div className="mt-2 bg-black/90 text-white p-3 rounded-md text-xs w-64">
          <h3 className="font-bold mb-2">Layout Measurements</h3>
          <div className="grid grid-cols-2 gap-1">
            <div>Viewport Width:</div>
            <div>{viewportWidth}px</div>

            <div>Document Width:</div>
            <div>{documentWidth}px</div>

            <div>Scrollbar Width:</div>
            <div>{scrollbarWidth}px</div>

            <div>Overflow:</div>
            <div>{documentWidth > viewportWidth ? `${documentWidth - viewportWidth}px` : "None"}</div>
          </div>

          <div className="mt-3 text-xs">
            <button
              onClick={() => {
                document.querySelectorAll("*").forEach((el) => {
                  const rect = el.getBoundingClientRect()
                  if (rect.right > viewportWidth || rect.left < 0) {
                    console.log("Overflow element:", el)
                    console.log("Width:", rect.width)
                    console.log("Position:", rect.left, "to", rect.right)

                    // Highlight the element
                    const originalOutline = (el as HTMLElement).style.outline
                    ;(el as HTMLElement).style.outline = "2px solid red"

                    // Reset after 5 seconds
                    setTimeout(() => {
                      ;(el as HTMLElement).style.outline = originalOutline
                    }, 5000)
                  }
                })
              }}
              className="bg-red-500 text-white px-2 py-1 rounded-md w-full"
            >
              Highlight Overflow Elements
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
