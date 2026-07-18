"use client";

import React, { useState, useMemo } from "react";
import Image, { type ImageProps } from "next/image";
import { getSafeImageUrl } from "./cloudinary";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop&q=80';

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
  const [errored, setErrored] = useState(false);

  const safeSrc = useMemo(() => {
    const w = width && !fill ? Number(width) : undefined;
    return getSafeImageUrl(src, w);
  }, [src, width, fill]);

  // If the primary source ever fails to load (dead path, blocked domain,
  // timeout, rate limit, etc.) fall back to a stock image instead of
  // leaving the loading shimmer spinning forever with nothing rendered —
  // that "stuck shimmer, nothing shows" state is what "images not
  // rendering" looks like from the outside.
  const displaySrc = errored ? FALLBACK_IMAGE : safeSrc;

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
        key={displaySrc}
        src={displaySrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes || "100vw"}
        fetchPriority={fetchPriority}
        onLoad={() => setLoading(false)}
        onError={() => {
          if (!errored) {
            setErrored(true);
          } else {
            // Fallback itself failed too (e.g. offline) — stop the shimmer
            // rather than spin forever.
            setLoading(false);
          }
        }}
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
