import Link from "next/link";
import { fetchPosts } from "@/lib/api";

export default async function Home() {
  const posts = await fetchPosts();

  return (
    <main className="max-w-2xl mx-auto py-12 px-4 font-sans text-neutral-900 dark:text-neutral-100">
      <header className="flex items-center justify-between pb-8 mb-10 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-2xl font-bold tracking-tight">Placeholder</h1>
        <Link
          href="/login"
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
        >
          Login
        </Link>
      </header>

      <section>
        {posts && posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 p-6 md:p-8 transition-all hover:border-neutral-300 dark:hover:border-neutral-700 shadow-xs"
              >
                <Link href={`/post/${post.slug}`} className="block">
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                  <time className="block mt-3 text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400 text-center py-12">
            The feed is quiet right now. Check back later.
          </p>
        )}
      </section>
    </main>
  );
}
