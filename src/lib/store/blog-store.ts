"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BlogPost } from "@/types/product";
import { blogPosts as DEFAULT_POSTS } from "@/lib/data/content";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface BlogState {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, "id">) => void;
  updatePost: (id: string, post: Omit<BlogPost, "id">) => void;
  deletePost: (id: string) => void;
}

export const useBlogStore = create<BlogState>()(
  persist(
    (set) => ({
      posts: DEFAULT_POSTS,

      addPost: (post) =>
        set((state) => ({ posts: [{ ...post, id: crypto.randomUUID() }, ...state.posts] })),

      updatePost: (id, post) =>
        set((state) => ({
          posts: state.posts.map((p) => (p.id === id ? { ...p, ...post } : p)),
        })),

      deletePost: (id) =>
        set((state) => ({ posts: state.posts.filter((p) => p.id !== id) })),
    }),
    { name: "estelaoferta-blog" },
  ),
);
