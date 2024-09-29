import React from "react";

export default function DefaultSkeleton() {
  return (
    <div className="max-w-full animate-pulse">
      <div className="mb-4 h-3 w-56 rounded-full bg-gray-300" />
      <div className="mb-2 h-2 w-72 rounded-full bg-gray-300" />
      <div className="mb-2 h-2 w-72 rounded-full bg-gray-300" />
      <div className="mb-2 h-2 w-72 rounded-full bg-gray-300" />
      <div className="mb-2 h-2 w-72 rounded-full bg-gray-300" />
    </div>
  );
}
