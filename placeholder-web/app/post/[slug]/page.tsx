import { fetchPostBySlug } from "@/lib/api";
import MonetizationSlot from "@/app/components/MonetizationSlot";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center text-neutral-500 dark:text-neutral-400">
        Post not found
      </div>
    );
  }

  const followerCount =
    post.authorFollowerCount ??
    post.author?.followerCount ??
    post.followerCount ??
    0;
  const category =
    post.authorCategory ?? post.author?.category ?? post.category ?? "";
  const adSenseClientId =
    post.authorAdSenseClientId ??
    post.author?.adSenseClientId ??
    post.adSenseClientId ??
    "";
  const showAds = post.showAds ?? post.author?.showAds ?? true;

  return (
    <article className="max-w-2xl mx-auto py-12 px-4 font-sans text-neutral-900 dark:text-neutral-100">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <time className="block text-sm text-neutral-500 dark:text-neutral-400">
        {new Date(post.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <hr className="my-8 border-neutral-200 dark:border-neutral-800" />
      <MonetizationSlot
        followerCount={followerCount}
        category={category}
        adSenseClientId={adSenseClientId}
        showAds={showAds}
      />
      <div
        dangerouslySetInnerHTML={{ __html: post.contentJson }}
        className="prose prose-lg prose-slate dark:prose-invert mx-auto prose-a:text-blue-600 prose-headings:font-bold prose-img:rounded-xl"
      />
    </article>
  );
}
