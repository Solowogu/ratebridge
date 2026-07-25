"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AlertStatusButtonProps = {
  alertId: string;
  isActive: boolean;
};

export default function AlertStatusButton({
  alertId,
  isActive,
}: AlertStatusButtonProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setIsUpdating(true);
    setError("");

    try {
      const response = await fetch(`/api/rate-alerts/${alertId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to update alert.");
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update alert."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isUpdating}
        className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
          isActive
            ? "bg-amber-600 hover:bg-amber-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isUpdating
          ? "Updating..."
          : isActive
            ? "Pause"
            : "Resume"}
      </button>

      {error && (
        <p className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}