"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Default placeholder image path
const PLACEHOLDER_IMAGE = "/images/tp-placeholder-img.jpg"

interface ProductImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
}

export function ProductImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  objectFit = "cover",
}: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState(src || PLACEHOLDER_IMAGE)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    console.error(`Failed to load image: ${src}`)
    setImageSrc(PLACEHOLDER_IMAGE)
    setHasError(true)
  }

  // Check if the image is from S3 and is properly configured
  const isS3Image = imageSrc?.includes("teal-parrot.s3.eu-north-1.amazonaws.com")

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          // When using the placeholder image (hasError is true), always use object-cover to fill the container
          hasError
            ? "object-cover w-full h-full"
            : objectFit === "contain"
              ? "object-contain"
              : objectFit === "cover"
                ? "object-cover"
                : objectFit === "fill"
                  ? "object-fill"
                  : objectFit === "none"
                    ? "object-none"
                    : objectFit === "scale-down"
                      ? "object-scale-down"
                      : "",
        )}
        onLoadingComplete={() => setIsLoading(false)}
        onError={handleError}
        style={{
          // When using placeholder, ensure it fills the container completely
          objectFit: hasError ? "cover" : objectFit,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Add a debug message during development */}
      {process.env.NODE_ENV === "development" && isS3Image && hasError && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1 text-center">
          S3 image failed to load. Check next.config.js
        </div>
      )}
    </div>
  )
}
