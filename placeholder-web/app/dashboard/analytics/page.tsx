"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TopPost {
  id: number;
  title: string;
  slug: string;
  impressions: number;
  legacyViews: number;
  publishedAt: string;
}

interface AnalyticsData {
  totalImpressions: number;
  totalLegacyViews: number;
  topPosts: TopPost[];
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function loadAnalytics() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://localhost:7111/api";
        const response = await fetch(`${apiUrl}/post/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          throw new Error("Failed to load analytics data.");
        }

        const data = await response.json();
        setAnalytics({
          totalImpressions: data.totalImpressions ?? data.TotalImpressions ?? 0,
          totalLegacyViews: data.totalLegacyViews ?? data.TotalLegacyViews ?? 0,
          topPosts: data.topPosts ?? data.TopPosts ?? [],
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error loading analytics."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, [router]);

  if (isLoading) {
    return (
      <main className="max-w-3xl mx-auto py-16 px-6 font-sans text-neutral-500 text-center">
        Loading analytics...
      </main>
    );
  }

  const totalImpressions = analytics?.totalImpressions ?? 0;
  const totalLegacyViews = analytics?.totalLegacyViews ?? 0;
  const topPosts = analytics?.topPosts ?? [];

  return (
    <main className="max-w-3xl mx-auto py-12 px-6 font-sans text-neutral-900 dark:text-neutral-100">
      <header className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Writer Analytics</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Performance and readership metrics across all your posts.
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
            href="/dashboard/settings"
            className="font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            Settings
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

      {error && (
        <div className="mb-6 p-3 text-sm rounded bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900">
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 shadow-xs">
          <span className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            Platform Impressions
          </span>
          <span className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {totalImpressions.toLocaleString()}
          </span>
        </div>

        <div className="p-6 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 shadow-xs">
          <span className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            Legacy Views
          </span>
          <span className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {totalLegacyViews.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Top 5 Most Viewed Posts */}
      <section>
        <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 mb-4">
          Top Viewed Posts
        </h2>

        {topPosts.length > 0 ? (
          <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 overflow-hidden shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Post Title
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold text-right">
                    Impressions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
                {topPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                      <Link
                        href={`/post/${post.slug}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-neutral-600 dark:text-neutral-300 font-semibold">
                      {post.impressions.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-500 dark:text-neutral-400 text-sm">
            No posts published yet. Start writing in the editor to track analytics.
          </div>
        )}
      </section>
    </main>
  );
}
