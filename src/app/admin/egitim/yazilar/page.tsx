import { getEducationPosts, getEducationCategories, createEducationPost, updateEducationPost, deleteEducationPost } from "@/lib/actions/education";
import AdminPostClient from "../../_components/AdminPostClient";

export default async function AdminEducationPostsPage() {
    const [postsResult, categoriesRaw] = await Promise.all([
        getEducationPosts(),
        getEducationCategories(),
    ]);
    const posts = JSON.parse(JSON.stringify(postsResult.posts));
    const categories = JSON.parse(JSON.stringify(categoriesRaw));

    return (
        <AdminPostClient
            title="Eğitim Yazıları"
            posts={posts}
            categories={categories}
            actions={{
                create: createEducationPost,
                update: updateEducationPost,
                delete: deleteEducationPost,
            }}
        />
    );
}
