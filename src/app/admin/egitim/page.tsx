import { getBlogCategories, getBlogPosts } from "@/lib/actions/blog";
import AdminEgitimClient from "./AdminEgitimClient";

export default async function AdminEgitimPage() {
  const [categoriesRaw, postsResult] = await Promise.all([
    getBlogCategories(),
    getBlogPosts(),
  ]);
  const categories = JSON.parse(JSON.stringify(categoriesRaw));
  const posts = JSON.parse(JSON.stringify(postsResult.posts));
  return <AdminEgitimClient categories={categories} posts={posts} />;
}
