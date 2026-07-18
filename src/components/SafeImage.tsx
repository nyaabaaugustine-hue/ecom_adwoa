"use client";

import React, { useState, useMemo } from "react";
import Image, { type ImageProps } from "next/image";
import { getSafeImageUrl } from "./cloudinary";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string;
  alt: string;
  className?: string;
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  sizes,
  fetchPriority,
  ...props
}: SafeImageProps) {
  const [isLoading, setLoading] = useState(true);

  const safeSrc = useMemo(() => {
    const w = width && !fill ? Number(width) : undefined;
    return getSafeImageUrl(src, w);
  }, [src, width, fill]);

  return (
    <div
      className={cn("relative overflow-hidden bg-gray-100", fill && "h-full w-full")}
      style={
        !fill
          ? {
              width: width ? `${width}px` : "100%",
              height: height ? `${height}px` : "auto",
            }
          : undefined
      }
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
      )}

      <Image
        src={safeSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes || "100vw"}
        fetchPriority={fetchPriority}
        onLoad={() => setLoading(false)}
        className={cn(
          "duration-700 ease-in-out",
          className,
          isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0"
        )}
        {...props}
      />
    </div>
  );
}
