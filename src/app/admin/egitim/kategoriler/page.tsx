import { getEducationCategories, createEducationCategory, updateEducationCategory, deleteEducationCategory } from "@/lib/actions/education";
import AdminCategoryClient from "../../_components/AdminCategoryClient";

export default async function AdminEducationCategoriesPage() {
    const categoriesRaw = await getEducationCategories();
    const categories = JSON.parse(JSON.stringify(categoriesRaw));

    return (
        <AdminCategoryClient
            title="Eğitim Kategorileri"
            categories={categories}
            actions={{
                create: createEducationCategory,
                update: updateEducationCategory,
                delete: deleteEducationCategory,
            }}
        />
    );
}
