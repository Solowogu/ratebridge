"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AlertStatusButtonProps = {
  alertId: string;
  isActive: boolean;
  isTriggered?: boolean;
  currentRate?: number;
  targetRate?: number;
  direction?: "above" | "below";
};

export default function AlertStatusButton({
  alertId,
  isActive,
  isTriggered = false,
  currentRate,
  targetRate,
  direction,
}: AlertStatusButtonProps) {
  const router = useRouter();

  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [showResumeWarning, setShowResumeWarning] =
    useState(false);

  const conditionAlreadyMet =
    !isActive &&
    isTriggered &&
    typeof currentRate === "number" &&
    typeof targetRate === "number" &&
    direction !== undefined &&
    (direction === "below"
      ? currentRate <= targetRate
      : currentRate >= targetRate);

  async function updateStatus() {
    setIsUpdating(true);
    setError("");

    try {
      const response = await fetch(
        `/api/rate-alerts/${alertId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to update alert."
        );
      }

      setShowResumeWarning(false);
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

  async function handleClick() {
    setError("");

    if (conditionAlreadyMet) {
      setShowResumeWarning(true);
      return;
    }

    await updateStatus();
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

      {showResumeWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              Target already reached
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              The current exchange rate already satisfies
              this alert. If you resume it, another
              notification may be sent on the next
              scheduled rate check.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowResumeWarning(false)
                }
                disabled={isUpdating}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={updateStatus}
                disabled={isUpdating}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {isUpdating
                  ? "Resuming..."
                  : "Resume Anyway"}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}