"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      router.push("/login");
    } else {
      setToken(savedToken);
    }
  }, [router]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Tell your story...",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose lg:prose-xl dark:prose-invert focus:outline-none min-h-[350px] max-w-none text-neutral-900 dark:text-neutral-100",
      },
    },
    immediatelyRender: false,
  });

  async function handlePublish() {
    if (!title.trim()) {
      alert("Please enter a title for your post.");
      return;
    }

    if (!editor || editor.isEmpty) {
      alert("Please write some content before publishing.");
      return;
    }

    setIsPublishing(true);

    try {
      const contentJson = JSON.stringify(editor.getJSON());
      const currentToken = token || localStorage.getItem("token");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          title,
          contentJson,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to publish post.");
      }

      const post = await response.json();
      router.push(`/post/${post.slug}`);
    } catch (error) {
      console.error("Error publishing post:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while publishing."
      );
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-6 font-sans">
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">Writer Studio</span>
          <span className="text-neutral-400">·</span>
          <Link
            href="/dashboard/analytics"
            className="font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            Analytics
          </Link>
          <span className="text-neutral-400">·</span>
          <Link
            href="/dashboard/settings"
            className="font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            Settings
          </Link>
        </div>
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="px-5 py-2 text-sm font-medium rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-4xl lg:text-5xl font-bold placeholder-neutral-300 dark:placeholder-neutral-700 bg-transparent border-none outline-none focus:outline-none mb-8 text-neutral-900 dark:text-neutral-100"
      />

      <div className="min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
    </main>
  );
}
