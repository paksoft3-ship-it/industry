import { getBlogPosts, getBlogCategories, createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/actions/blog";
import AdminPostClient from "../../_components/AdminPostClient";

export default async function AdminBlogPostsPage() {
    const [postsResult, categoriesRaw] = await Promise.all([
        getBlogPosts(),
        getBlogCategories(),
    ]);
    const posts = JSON.parse(JSON.stringify(postsResult.posts));
    const categories = JSON.parse(JSON.stringify(categoriesRaw));

    return (
        <AdminPostClient
            title="Blog Yazıları"
            posts={posts}
            categories={categories}
            actions={{
                create: createBlogPost,
                update: updateBlogPost,
                delete: deleteBlogPost,
            }}
        />
    );
}
