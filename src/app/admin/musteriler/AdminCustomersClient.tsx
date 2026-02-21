"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 }).format(value);
}

export default function AdminCustomersClient({
  customers,
  total,
  totalPages,
  currentPage,
  filters,
}: {
  customers: Customer[];
  total: number;
  totalPages: number;
  currentPage: number;
  filters: { search: string; sortBy: string; sortOrder: string };
}) {
  const router = useRouter();
  const [search, setSearch] = useState(filters.search);

  function updateFilters(updates: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = { ...filters, ...updates };
    if (merged.search) params.set("search", merged.search);
    if (merged.sortBy && merged.sortBy !== "createdAt") params.set("sortBy", merged.sortBy);
    if (merged.sortOrder && merged.sortOrder !== "desc") params.set("sortOrder", merged.sortOrder);
    if (updates.page) params.set("page", updates.page);
    router.push(`/admin/musteriler?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilters({ search });
  }

  function getInitials(firstName: string, lastName: string) {
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  }

  function getCustomerStatus(c: Customer) {
    const daysSinceRegistration = Math.floor(
      (Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (c.orderCount === 0 && daysSinceRegistration <= 30) return { label: "Yeni", cls: "bg-blue-100 text-blue-700" };
    if (c.orderCount > 0) return { label: "Aktif", cls: "bg-green-100 text-green-700" };
    return { label: "Pasif", cls: "bg-gray-100 text-gray-500" };
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-gray-800">Müşteriler</h1>
          <p className="text-sm text-gray-500 mt-1">Toplam {total} kayıtlı müşteri</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <form onSubmit={handleSearch} className="flex-1 min-w-[240px] relative">
            <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="İsim, e-posta veya telefon ile ara..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </form>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-");
              updateFilters({ sortBy, sortOrder, page: "" });
            }}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="createdAt-desc">Son Kayıt</option>
            <option value="createdAt-asc">İlk Kayıt</option>
            <option value="name-asc">İsme Göre A-Z</option>
            <option value="name-desc">İsme Göre Z-A</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Müşteri</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">E-posta</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefon</th>
                <th className="text-center px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Siparişler</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Toplam Harcama</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">Müşteri bulunamadı</td>
                </tr>
              )}
              {customers.map((customer) => {
                const status = getCustomerStatus(customer);
                return (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary text-sm font-semibold">
                            {getInitials(customer.firstName, customer.lastName)}
                          </span>
                        </div>
                        <Link href={`/admin/musteriler/${customer.id}`} className="font-medium text-gray-800 hover:text-primary transition-colors">
                          {customer.firstName} {customer.lastName}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{customer.email}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{customer.phone || "—"}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{customer.orderCount}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-800">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/musteriler/${customer.id}`}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors inline-flex"
                        title="Detay"
                      >
                        <MaterialIcon icon="visibility" className="text-lg" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {(currentPage - 1) * 20 + 1}-{Math.min(currentPage * 20, total)} / {total} müşteri
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateFilters({ page: String(currentPage - 1) })}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                Önceki
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateFilters({ page: String(pageNum) })}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      pageNum === currentPage ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => updateFilters({ page: String(currentPage + 1) })}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
