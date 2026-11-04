"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  followerCount: number;
  category: string;
  adSenseClientId: string | null;
  isPro: boolean;
  showAds: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [adSenseClientId, setAdSenseClientId] = useState("");
  const [showAds, setShowAds] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function loadProfile() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          throw new Error("Failed to load user profile.");
        }

        const data: UserProfile = await response.json();
        setProfile(data);
        setAdSenseClientId(data.adSenseClientId || "");
        setShowAds(data.showAds ?? true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading profile.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsSaving(true);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            adSenseClientId: adSenseClientId.trim() || null,
            showAds,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update settings.");
      }

      setMessage("Settings saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred while saving."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function getTierInfo(followers: number) {
    if (followers >= 1000) {
      return {
        label: "Tier 3: Pro (1,000+ followers)",
        badge: "Tier 3: Pro",
        description:
          "High-traffic tier. Eligible for premium ethical networks (EthicalAds / Media.net).",
        badgeStyle:
          "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
      };
    }
    if (followers >= 500) {
      return {
        label: "Tier 2: Rising Star (500–999 followers)",
        badge: "Tier 2: Rising Star",
        description:
          "Mid-tier creator. Control whether to display ads or provide a quiet reading experience.",
        badgeStyle:
          "bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
      };
    }
    return {
      label: "Tier 1: Starter (<500 followers)",
      badge: "Tier 1: Starter",
      description:
        "Standard monetization tier. Monetize your content with your Google AdSense Client ID.",
      badgeStyle:
        "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700",
    };
  }

  if (isLoading) {
    return (
      <main className="max-w-2xl mx-auto py-16 px-6 font-sans text-neutral-500 text-center">
        Loading profile & settings...
      </main>
    );
  }

  const followers = profile?.followerCount ?? 0;
  const tier = getTierInfo(followers);

  return (
    <main className="max-w-2xl mx-auto py-12 px-6 font-sans text-neutral-900 dark:text-neutral-100">
      <header className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings & Profile</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {profile?.username} · {profile?.email} ({profile?.category})
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/dashboard"
            className="font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            Editor
          </Link>
          <span>·</span>
          <Link
            href="/"
            className="font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            Feed
          </Link>
        </div>
      </header>

      {message && (
        <div className="mb-6 p-3 text-sm rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 text-sm rounded bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900">
          {error}
        </div>
      )}

      {/* Growth Ladder Status */}
      <section className="mb-10 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 mb-4">
          Growth Ladder Status
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <span className="block text-3xl font-bold tracking-tight">
              {followers.toLocaleString()}
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Total Followers
            </span>
          </div>

          <div>
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${tier.badgeStyle}`}
            >
              {tier.badge}
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              {tier.description}
            </p>
          </div>
        </div>
      </section>

      {/* Monetization Settings Form */}
      <section>
        <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 mb-4">
          Monetization Configuration
        </h2>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div>
            <label
              htmlFor="adSenseClientId"
              className="block text-sm font-medium mb-1"
            >
              Google AdSense Client ID
            </label>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
              Used to render your AdSense units on your published posts for Tier 1 and Tier 2.
            </p>
            <input
              id="adSenseClientId"
              type="text"
              value={adSenseClientId}
              onChange={(e) => setAdSenseClientId(e.target.value)}
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              className="w-full px-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-colors font-mono"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="showAds"
              type="checkbox"
              checked={showAds}
              onChange={(e) => setShowAds(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
            <label htmlFor="showAds" className="text-sm select-none">
              Enable ad placements on my posts (Tier 2 can disable this for a clean reading experience)
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="py-2.5 px-5 text-sm font-medium rounded-md bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </section>
    </main>
  );
}
