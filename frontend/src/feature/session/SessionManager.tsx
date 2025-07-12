import React from "react";
import { useSessionStore } from "../../store/sessionStore";

const SessionManager: React.FC = () => {
  const { hasMemory, loading, error } = useSessionStore();

  if (loading) {
    return (
      <div className="border-t p-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"></div>
          Loading session...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-t p-4">
        <div className="text-sm text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${hasMemory ? "bg-green-500" : "bg-gray-300"}`}
        ></div>
        <span className="text-sm text-gray-600">
          {hasMemory ? "Memory Active" : "Memory Empty"}
        </span>
      </div>
    </div>
  );
};

export default SessionManager;
