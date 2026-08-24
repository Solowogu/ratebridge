"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../components/Modal";

type AlertDirection = "above" | "below";

type EditAlertButtonProps = {
  alertId: string;
  initialEmail: string;
  initialTargetRate: string;
  initialDirection: AlertDirection;
};

type UpdateAlertResponse = {
  success?: boolean;
  error?: string;
};

export default function EditAlertButton({
  alertId,
  initialEmail,
  initialTargetRate,
  initialDirection,
}: EditAlertButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [targetRate, setTargetRate] =
    useState(initialTargetRate);
  const [direction, setDirection] =
    useState<AlertDirection>(initialDirection);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function openModal() {
    setEmail(initialEmail);
    setTargetRate(initialTargetRate);
    setDirection(initialDirection);
    setError("");
    setIsOpen(true);
  }

  function closeModal() {
    if (!isSaving) {
      setIsOpen(false);
      setError("");
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const numericTargetRate = Number(targetRate);

    if (!email.trim()) {
      setError("Please enter an email address.");
      return;
    }

    if (
      !Number.isFinite(numericTargetRate) ||
      numericTargetRate <= 0
    ) {
      setError("Please enter a valid target rate.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/rate-alerts/${alertId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            targetRate: numericTargetRate,
            direction,
          }),
        }
      );

      const data: UpdateAlertResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to update alert."
        );
      }

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update alert."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Edit
      </button>

      <Modal
        title="Edit Rate Alert"
        open={isOpen}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor={`edit-email-${alertId}`}
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email address
            </label>

            <input
              id={`edit-email-${alertId}`}
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor={`edit-direction-${alertId}`}
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Alert when
            </label>

            <select
              id={`edit-direction-${alertId}`}
              value={direction}
              onChange={(event) => {
                setDirection(
                  event.target.value as AlertDirection
                );
                setError("");
              }}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
            >
              <option value="above">
                Rate rises to
              </option>

              <option value="below">
                Rate falls to
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor={`edit-target-${alertId}`}
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Target rate
            </label>

            <input
              id={`edit-target-${alertId}`}
              type="number"
              min="0.000001"
              step="any"
              value={targetRate}
              onChange={(event) => {
                setTargetRate(event.target.value);
                setError("");
              }}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSaving}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}