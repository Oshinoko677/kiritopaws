"use client";
import { useState } from "react";

export default function SafeImage({ src, alt, className, emoji, fit }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={className + " flex items-center justify-center bg-purple-100 text-5xl"}>
        {emoji || "🐾"}
      </div>
    );
  }

  if (fit === "contain") {
    return (
      <div className={className + " bg-white p-3 flex items-center justify-center"}>
        <img
          src={src}
          alt={alt || ""}
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ""}
      className={className + " object-cover"}
      onError={() => setFailed(true)}
    />
  );
}