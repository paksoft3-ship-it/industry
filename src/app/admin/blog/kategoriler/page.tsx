import { getBlogCategories, createBlogCategory, updateBlogCategory, deleteBlogCategory } from "@/lib/actions/blog";
import AdminCategoryClient from "../../_components/AdminCategoryClient";

export default async function AdminBlogCategoriesPage() {
    const categoriesRaw = await getBlogCategories();
    const categories = JSON.parse(JSON.stringify(categoriesRaw));

    return (
        <AdminCategoryClient
            title="Blog Kategorileri"
            categories={categories}
            actions={{
                create: createBlogCategory,
                update: updateBlogCategory,
                delete: deleteBlogCategory,
            }}
        />
    );
}
