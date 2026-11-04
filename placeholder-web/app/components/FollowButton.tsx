"use client";

import { useState } from "react";

interface FollowButtonProps {
  authorId: number;
}

export default function FollowButton({ authorId }: FollowButtonProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "subscribed" | "denied" | "unsupported"
  >("idle");

  const isSupported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window;

  async function handleFollow() {
    if (!isSupported) {
      setStatus("unsupported");
      return;
    }

    setStatus("loading");

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/push/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authorUserId: authorId,
            endpoint: subscription.endpoint,
            p256dh: btoa(
              String.fromCharCode(
                ...new Uint8Array(subscription.getKey("p256dh")!)
              )
            ),
            auth: btoa(
              String.fromCharCode(
                ...new Uint8Array(subscription.getKey("auth")!)
              )
            ),
          }),
        }
      );

      if (response.ok) {
        setStatus("subscribed");
      } else {
        throw new Error("Failed to save subscription on server.");
      }
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
      setStatus("idle");
    }
  }

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={handleFollow}
      disabled={status === "loading" || status === "subscribed"}
      className="px-4 py-2 text-sm font-medium rounded-md transition-colors border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {status === "idle" && "Follow"}
      {status === "loading" && "Subscribing..."}
      {status === "subscribed" && "Following ✓"}
      {status === "denied" && "Notifications Blocked"}
      {status === "unsupported" && "Not Supported"}
    </button>
  );
}
