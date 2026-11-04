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
              <article key={post.id} className="group">
                <Link href={`/post/${post.slug}`} className="block">
                  <h2 className="text-xl font-semibold tracking-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                    {post.title}
                  </h2>
                  <time className="block mt-1 text-sm text-neutral-500 dark:text-neutral-400">
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
