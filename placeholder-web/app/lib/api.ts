export interface Post {
  id: number;
  title: string;
  slug: string;
  contentJson: string;
  publishedAt: string;
}

export async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }

    const data: Post[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchPosts:', error);
    return [];
  }
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
    }

    const data: Post = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in fetchPostBySlug (${slug}):`, error);
    return null;
  }
}
